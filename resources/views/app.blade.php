<!doctype html>
<html class="notranslate" lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no">
    <head>
        @php
            $siteTitle = 'LHS Archive';
            $siteDescription = 'Tempat kecil buat nyimpen semua hal yang pernah rame bareng: link, polaroid moments, archived humans, pesan, dan best moment video.';
            $siteImage = asset('og-lhs-archive.svg');
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#121414">
        <meta name="description" content="{{ $siteDescription }}">
        <meta name="application-name" content="{{ $siteTitle }}">
        <meta name="google" content="notranslate">
        <link rel="canonical" href="{{ url('/') }}">

        <meta property="og:site_name" content="{{ $siteTitle }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $siteTitle }}">
        <meta property="og:description" content="{{ $siteDescription }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ $siteImage }}">
        <meta property="og:image:type" content="image/svg+xml">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $siteTitle }}">
        <meta name="twitter:description" content="{{ $siteDescription }}">
        <meta name="twitter:image" content="{{ $siteImage }}">

        <title>{{ $siteTitle }}</title>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body translate="no">
        <div id="root"></div>
    </body>
</html>
