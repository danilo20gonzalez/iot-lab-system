// components/Footer.tsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Información del Sistema */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">
                Sistema de Gestión de Laboratorios
              </h3>
              <p className="text-gray-300 mb-4">
                Plataforma integral para el monitoreo y control de laboratorios, 
                sensores ambientales y automatización de procesos.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Sistema en Tiempo Real</span>
              </div>
            </div>
  
            {/* Enlaces Rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Módulos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Laboratorios</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sensores</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Estanterías</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cámaras</a></li>
              </ul>
            </div>
  
            {/* Soporte y Contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📧 soporte@labcontrol.com</li>
                <li>📞 +57 1 234 5678</li>
                <li>🕒 24/7 Monitoreo</li>
              </ul>
            </div>
          </div>
  
          {/* Línea divisoria */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © {currentYear} LabControl System. Todos los derechos reservados.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">v1.0.0</span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">Sistema Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }