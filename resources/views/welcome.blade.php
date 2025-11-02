<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Horarios</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}">
    
    {{-- React + Vite --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    {{-- Tailwind base styles --}}
    <script>
        // Soporte simple para dark mode
        if (localStorage.getItem('theme') === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">

    {{-- React se monta aquí --}}
    <main class="flex-1 p-6">
        <div id="app"></div>
    </main>

    {{-- Footer --}}
    <footer class="bg-gray-200 dark:bg-gray-800 text-center py-3 text-sm">
        © {{ date('Y') }} - Sistema de Horarios | UNAP
    </footer>
</body>
</html>
