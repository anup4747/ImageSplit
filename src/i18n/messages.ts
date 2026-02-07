/**
 * i18n Messages - Scaffold for Internationalization
 * To enable:
 * 1. npm install next-intl
 * 2. Wrap app with IntlProvider
 * 3. Use useTranslations() hook in components
 */

export const messages = {
  en: {
    'app.title': 'Image Splitter',
    'app.description': 'Split images into printable pages',
    'app.subtitle': 'Upload an image and split it into printable pages',

    // Actions
    'action.apply': 'Apply',
    'action.undo': 'Undo',
    'action.redo': 'Redo',
    'action.shuffle': 'Shuffle',
    'action.grid': 'Grid',
    'action.overlap': 'Overlap',
    'action.reset': 'Reset',
    'action.newImage': 'New Image',

    // Wall Settings
    'wall.title': 'Wall Dimensions',
    'wall.width': 'Width',
    'wall.height': 'Height',
    'wall.units': 'Units (cm, m, ft)',
    'wall.apply': 'Apply Dimensions',
    'wall.noChanges': 'No Changes',

    // Export
    'export.title': 'Export Options',
    'export.images': 'Export as Images (ZIP)',
    'export.pdfs': 'Export as PDFs (ZIP)',
    'export.exporting': 'Exporting...',
    'export.generatingPdfs': 'Generating PDFs...',

    // Upload
    'upload.dropHere': 'Drop your image here',
    'upload.clickToBrowse': 'or click to browse',
    'upload.supports': 'Supports PNG, JPG, WEBP',
    'upload.processing': 'Processing image...',
    'upload.pleaseWait': 'Please wait',
    'upload.splitting': 'Splitting image into pages...',

    // Page Sizes
    'pageSize.title': 'Page Size',
    'pageSize.a4': 'A4',
    'pageSize.a3': 'A3',
    'pageSize.letter': 'Letter',
    'pageSize.custom': 'Custom',

    // Canvas
    'canvas.dragToMove': 'Drag pages to move',
    'canvas.scrollToZoom': 'Scroll to zoom',
    'canvas.altDragToPan': 'Alt+drag to pan',

    // Messages
    'message.success': 'Success!',
    'message.error': 'Error',
    'message.loading': 'Loading...',
    'message.noImages': 'No pages loaded. Upload an image to begin.',
  },
  es: {
    'app.title': 'Divisor de Imágenes',
    'app.description': 'Divide imágenes en páginas imprimibles',
    'app.subtitle': 'Cargue una imagen y divídala en páginas imprimibles',

    'action.apply': 'Aplicar',
    'action.undo': 'Deshacer',
    'action.redo': 'Rehacer',
    'action.shuffle': 'Mezclar',
    'action.grid': 'Cuadrícula',
    'action.overlap': 'Superposición',
    'action.reset': 'Reiniciar',
    'action.newImage': 'Nueva Imagen',

    'wall.title': 'Dimensiones del Muro',
    'wall.width': 'Ancho',
    'wall.height': 'Altura',
    'wall.units': 'Unidades (cm, m, ft)',
    'wall.apply': 'Aplicar Dimensiones',
    'wall.noChanges': 'Sin cambios',

    'export.title': 'Opciones de Exportación',
    'export.images': 'Exportar como Imágenes (ZIP)',
    'export.pdfs': 'Exportar como PDFs (ZIP)',
    'export.exporting': 'Exportando...',
    'export.generatingPdfs': 'Generando PDFs...',

    'upload.dropHere': 'Suelta tu imagen aquí',
    'upload.clickToBrowse': 'o haz clic para examinar',
    'upload.supports': 'Soporta PNG, JPG, WEBP',
    'upload.processing': 'Procesando imagen...',
    'upload.pleaseWait': 'Por favor espere',
    'upload.splitting': 'Dividiendo imagen en páginas...',

    'pageSize.title': 'Tamaño de Página',
    'pageSize.a4': 'A4',
    'pageSize.a3': 'A3',
    'pageSize.letter': 'Letter',
    'pageSize.custom': 'Personalizado',

    'canvas.dragToMove': 'Arrastrar para mover',
    'canvas.scrollToZoom': 'Desplazar para zoom',
    'canvas.altDragToPan': 'Alt+arrastra para desplazar',

    'message.success': '¡Éxito!',
    'message.error': 'Error',
    'message.loading': 'Cargando...',
    'message.noImages': 'Sin páginas cargadas. Cargue una imagen para comenzar.',
  },
  fr: {
    'app.title': 'Diviseur d\'Images',
    'app.description': 'Divisez les images en pages imprimables',
    'app.subtitle': 'Téléchargez une image et divisez-la en pages imprimables',

    'action.apply': 'Appliquer',
    'action.undo': 'Annuler',
    'action.redo': 'Rétablir',
    'action.shuffle': 'Mélanger',
    'action.grid': 'Grille',
    'action.overlap': 'Chevauchement',
    'action.reset': 'Réinitialiser',
    'action.newImage': 'Nouvelle image',

    'wall.title': 'Dimensions du Mur',
    'wall.width': 'Largeur',
    'wall.height': 'Hauteur',
    'wall.units': 'Unités (cm, m, ft)',
    'wall.apply': 'Appliquer les dimensions',
    'wall.noChanges': 'Aucun changement',

    'export.title': 'Options d\'export',
    'export.images': 'Exporter en tant qu\'images (ZIP)',
    'export.pdfs': 'Exporter en tant que PDF (ZIP)',
    'export.exporting': 'Export en cours...',
    'export.generatingPdfs': 'Génération des PDF...',

    'upload.dropHere': 'Déposez votre image ici',
    'upload.clickToBrowse': 'ou cliquez pour parcourir',
    'upload.supports': 'Supporte PNG, JPG, WEBP',
    'upload.processing': 'Traitement de l\'image...',
    'upload.pleaseWait': 'Veuillez patienter',
    'upload.splitting': 'Division de l\'image en pages...',

    'pageSize.title': 'Taille de la page',
    'pageSize.a4': 'A4',
    'pageSize.a3': 'A3',
    'pageSize.letter': 'Lettre',
    'pageSize.custom': 'Personnalisé',

    'canvas.dragToMove': 'Faire glisser pour déplacer',
    'canvas.scrollToZoom': 'Faites défiler pour zoomer',
    'canvas.altDragToPan': 'Alt+glisser pour panoramique',

    'message.success': 'Succès !',
    'message.error': 'Erreur',
    'message.loading': 'Chargement...',
    'message.noImages': 'Aucune page chargée. Téléchargez une image pour commencer.',
  },
}

export type MessageKey = keyof typeof messages.en
export type Language = keyof typeof messages
