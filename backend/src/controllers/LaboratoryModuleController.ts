import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';





export const getModulos = async (req: Request, res: Response) => {
  try {

    // Consultar laboratorios + usuarios asociados
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        m.ID_MODULO_LABORATORIO AS codigo,
        m.NOMBRE_MODULO_MODULO_LABORATORIO AS nombre,
        m.DESCRIPCION_MODULO_LABORATORIO AS descripcion,
        m.PK_ID_ESTADO_MODULO_LABORATORIO AS estadoId,
        -- total de usuarios asociados
        (
          SELECT COUNT(DISTINCT u2.ID_USUARIO)
          FROM USUARIO_MODULO_LABORATORIO uml2
          JOIN USUARIO u2 ON u2.ID_USUARIO = uml2.FK_ID_USUARIO
          WHERE uml2.FK_ID_MODULO_LABORATORIO = m.ID_MODULO_LABORATORIO
        ) AS totalUsuarios,
        -- arreglo JSON de usuarios asociados [{id, username}]
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
                   'id', u3.ID_USUARIO,
                   'username', u3.USERNAME
                 ))
          FROM (
            SELECT DISTINCT u.ID_USUARIO, u.USERNAME
            FROM USUARIO_MODULO_LABORATORIO uml3
            JOIN USUARIO u ON u.ID_USUARIO = uml3.FK_ID_USUARIO
            WHERE uml3.FK_ID_MODULO_LABORATORIO = m.ID_MODULO_LABORATORIO
            ORDER BY u.ID_USUARIO
          ) AS u3
        ), JSON_ARRAY()) AS usuarios
      FROM MODULO_LABORATORIO m
      ORDER BY m.ID_MODULO_LABORATORIO DESC;
    `);

    if (!rows || rows.length === 0) {
      // Mensaje requerido por la HU-09
      return res.status(200).json({
        message: 'Ningún laboratorio registrado',
        data: []
      });
    }

    // Normalizar el campo JSON si viniera como string
    const data = rows.map((r: any) => ({
      codigo: r.codigo,
      nombre: r.nombre,
      descripcion: r.descripcion,
      estadoId: r.estadoId,
      totalUsuarios: Number(r.totalUsuarios) || 0,
      usuarios: typeof r.usuarios === 'string'
        ? JSON.parse(r.usuarios)
        : (r.usuarios ?? [])
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    return res.status(500).json({ message: 'Error al obtener módulos' });
  }
};




// Obtener módulo por ID
export const getModuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT ID_MODULO_LABORATORIO AS id, NOMBRE_MODULO_MODULO_LABORATORIO AS nombre, DESCRIPCION_MODULO_LABORATORIO AS descripcion, PK_ID_ESTADO_MODULO_LABORATORIO AS estadoId FROM modulo_laboratorio WHERE ID_MODULO_LABORATORIO = ?',
      [id]
    );
    const modulo = rows[0];
    if (!modulo) return res.status(404).json({ message: 'Módulo no encontrado' });
    res.json(modulo);
  } catch (error) {
    console.error('Error al obtener módulo:', error);
    res.status(500).json({ message: 'Error al obtener módulo' });
  }
};


// Crear módulo con asociación de usuarios (corregido)---------------------------------------------------------------
export const createModulo = async (req: Request, res: Response) => {
  const conn = await pool.getConnection(); // mysql2/promise
  try {
    const { nombre, descripcion, estadoId, usuarios } = req.body;

    await conn.beginTransaction();

    // 1) Crear el módulo
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO modulo_laboratorio
       (NOMBRE_MODULO_MODULO_LABORATORIO, DESCRIPCION_MODULO_LABORATORIO, PK_ID_ESTADO_MODULO_LABORATORIO)
       VALUES (?, ?, ?)`,
      [nombre, descripcion, estadoId]
    );

    const moduloId = (result as ResultSetHeader).insertId;

    // 2) Asociar usuarios al módulo (si vienen)
    if (Array.isArray(usuarios) && usuarios.length > 0) {
      // IMPORTANTE: el orden de columnas debe ser (FK_ID_USUARIO, FK_ID_MODULO_LABORATORIO)
      // y el bulk insert de mysql2 usa VALUES ? con un array de arrays.
      const values = usuarios.map((usuarioId: number) => [usuarioId, moduloId]);

      await conn.query(
        `INSERT INTO USUARIO_MODULO_LABORATORIO
         (FK_ID_USUARIO, FK_ID_MODULO_LABORATORIO)
         VALUES ?`,
        [values] // ojo: un solo parámetro que es el array de filas
      );
    }

    await conn.commit();

    res.status(201).json({
      message: 'Módulo creado correctamente',
      modulo: { id: moduloId, nombre, descripcion, estadoId, usuarios: usuarios ?? [] },
    });
  } catch (error) {
    await conn.rollback();
    console.error('Error al crear módulo:', error);
    res.status(500).json({ message: 'Error al crear módulo' });
  } finally {
    conn.release();
  }
};




// Actualizar módulo con asociación de usuarios (OK con ID_MODULO_LABORATORIO y pivote FK_*)---------------------------------------------------------------
export const updateModulo = async (req: Request, res: Response) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params; // este es ID_MODULO_LABORATORIO
    const { nombre, descripcion, estadoId, usuarios } = req.body;

    if (!nombre || !descripcion || !estadoId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    await conn.beginTransaction();

    // 1) Actualizar el módulo
    const [result] = await conn.query<ResultSetHeader>(
      `UPDATE modulo_laboratorio
         SET NOMBRE_MODULO_MODULO_LABORATORIO = ?,
             DESCRIPCION_MODULO_LABORATORIO   = ?,
             PK_ID_ESTADO_MODULO_LABORATORIO  = ?
       WHERE ID_MODULO_LABORATORIO = ?`,            // <-- nombre correcto de la PK
      [nombre, descripcion, estadoId, id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Módulo no encontrado' });
    }

    // 2) Resincronizar asociaciones solo si 'usuarios' viene en el body
    if (typeof usuarios !== 'undefined') {
      // limpiar actuales
      await conn.query(
        `DELETE FROM USUARIO_MODULO_LABORATORIO
         WHERE FK_ID_MODULO_LABORATORIO = ?`,       // <-- nombre correcto en pivote
        [id]
      );

      // insertar nuevas
      if (Array.isArray(usuarios) && usuarios.length > 0) {
        // Orden correcto de columnas: (FK_ID_USUARIO, FK_ID_MODULO_LABORATORIO)
        const values = usuarios.map((usuarioId: number) => [usuarioId, Number(id)]);

        await conn.query(
          `INSERT INTO USUARIO_MODULO_LABORATORIO
             (FK_ID_USUARIO, FK_ID_MODULO_LABORATORIO)
           VALUES ?`,
          [values] // bulk insert mysql2
        );
      }
    }

    await conn.commit();
    return res.json({
      message: 'Módulo actualizado correctamente',
      modulo: { id, nombre, descripcion, estadoId, usuarios: usuarios ?? 'sin cambios' },
    });
  } catch (error) {
    await conn.rollback();
    console.error('Error al actualizar módulo:', error);
    return res.status(500).json({ message: 'Error al actualizar módulo' });
  } finally {
    conn.release();
  }
};





// Eliminar módulo y sus asociaciones con manejo de claves foráneas (vía SP)///////////////////////////////////////////////////////////////////
export const deleteModulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminId, adminPassword, confirmDelete } = req.body;

    // Validar confirmación de eliminación
    if (!confirmDelete) {
      return res.status(400).json({ message: 'Debe confirmar la eliminación del módulo' });
    }

    // Validar que el usuario sea administrador y verificar su contraseña
    const [admin] = await pool.query<RowDataPacket[]>(
      `SELECT PASSWORD FROM USUARIO WHERE ID_USUARIO = ? AND FK_ID_ROL = 1`,
      [adminId]
    );

    if (!admin.length || admin[0].PASSWORD !== adminPassword) {
      return res.status(403).json({ message: 'Usuario no autorizado o contraseña incorrecta' });
    }

    // ✅ Llamar al procedimiento almacenado que elimina en cadena con transacción
    //    (Asume que ya creaste `eliminar_modulo_laboratorio_cadena(IN p_id_modulo INT)`)
    const [spResult] = await pool.query<any[]>(
      `CALL eliminar_modulo_laboratorio_cadena(?)`,
      [id]
    );

    // El SP devuelve un SELECT con el mensaje final; lo exponemos si viene
    const mensaje =
      Array.isArray(spResult) &&
      spResult[0] &&
      spResult[0][0] &&
      (spResult[0][0].mensaje || spResult[0][0].MENSAJE);

    return res.json({ message: mensaje || 'Módulo eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar módulo:', error);

    // Si el SP lanzó SIGNAL SQLSTATE '45000', MySQL expone sqlMessage
    if (error && error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }

    return res.status(500).json({ message: 'Error al eliminar módulo' });
  }
};



