-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 11, 2025 at 06:02 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sisHorario`
--
CREATE DATABASE IF NOT EXISTS `sisHorario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `sisHorario`;

-- --------------------------------------------------------

--
-- Table structure for table `curso`
--

CREATE TABLE `curso` (
  `idCurso` int NOT NULL,
  `nombre` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `tipo_curso` enum('electivo','obligatorio') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `horas_practica` int DEFAULT NULL,
  `horas_teoria` int DEFAULT NULL,
  `horas_totales` int DEFAULT NULL,
  `ciclo` enum('1','2','3','4','5','6','7','8','9','10') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `curso`
--

INSERT INTO `curso` (`idCurso`, `nombre`, `descripcion`, `tipo_curso`, `horas_practica`, `horas_teoria`, `horas_totales`, `ciclo`) VALUES
(1, 'Lenguaje,redaccion y oratoria', '-', 'obligatorio', 2, 3, 5, '1'),
(2, 'Matematica', '-', 'obligatorio', 2, 3, 5, '1'),
(3, 'Ingles basico I', '-', 'obligatorio', 2, 1, 3, '1'),
(4, 'Filosofia', '-', 'obligatorio', 2, 2, 4, '1'),
(5, 'Derecho constitucional y derechos humanos', '-', 'obligatorio', 2, 2, 4, '1'),
(6, 'Introduccion a la ingenieria de sistemas e informacion', '-', 'obligatorio', 2, 2, 4, '1'),
(7, 'Informatica I', '-', 'obligatorio', 2, 1, 3, '1'),
(8, 'Basquetbol', '-', 'electivo', 2, 0, 2, '1'),
(9, 'Futbol', '-', 'electivo', 2, 0, 2, '1'),
(10, 'Calculo diferencial', '-', 'obligatorio', 2, 3, 5, '2'),
(11, 'Inglés básico II', '-', 'obligatorio', 2, 1, 3, '2'),
(12, 'Algebra lineal', '-', 'obligatorio', 2, 3, 5, '2'),
(13, 'Algoritmo y estructura de datos', '-', 'obligatorio', 2, 2, 4, '2'),
(14, 'Realidad nacional y desarrollo regional amazónico', '-', 'obligatorio', 2, 3, 5, '2'),
(15, 'Informática II', '-', 'obligatorio', 2, 1, 3, '2'),
(16, 'Metodología de la investigación científica', '-', 'obligatorio', 2, 3, 5, '2'),
(17, 'Atletismo', '-', 'electivo', 2, 0, 2, '2'),
(18, 'Voleibol', '-', 'electivo', 2, 0, 2, '2'),
(19, 'Economia', '-', 'obligatorio', 2, 2, 4, '3'),
(20, 'Calculo integral', '-', 'obligatorio', 2, 3, 5, '3'),
(21, 'Estadistica y probabilidad', '-', 'obligatorio', 2, 2, 4, '3'),
(22, 'Matematica discreta', '-', 'obligatorio', 2, 2, 4, '3'),
(23, 'Lenguaje de programación I', '-', 'obligatorio', 2, 2, 4, '3'),
(24, 'Fisica', '-', 'obligatorio', 2, 3, 5, '3'),
(25, 'Base de datos I', '-', 'obligatorio', 2, 2, 4, '3'),
(26, 'Fisica electronica', '-', 'obligatorio', 2, 3, 5, '4'),
(27, 'Estadistica inferencial', '-', 'obligatorio', 2, 2, 4, '4'),
(28, 'Ingles tecnico I', '-', 'obligatorio', 2, 1, 3, '4'),
(29, 'Base de datos II', '-', 'obligatorio', 2, 2, 4, '4'),
(30, 'Administracion general', '-', 'obligatorio', 2, 2, 4, '4'),
(31, 'Ecuaciones diferenciales', '-', 'obligatorio', 2, 3, 5, '4'),
(32, 'Lenguaje de programacion II', '-', 'obligatorio', 2, 2, 4, '4'),
(33, 'Electrónica digital', '-', 'obligatorio', 2, 2, 4, '5'),
(34, 'Marketing digital', '-', 'obligatorio', 2, 1, 3, '5'),
(35, 'Sistemas contables', '-', 'obligatorio', 2, 1, 3, '5'),
(36, 'Taller de base de datos', '-', 'obligatorio', 2, 2, 4, '5'),
(37, 'Lenguaje de programacion III', '-', 'obligatorio', 4, 4, 8, '5'),
(38, 'Teoría general de sistemas', '-', 'obligatorio', 2, 1, 3, '5'),
(39, 'Ecología', '-', 'obligatorio', 2, 1, 3, '5'),
(40, 'Metodos numericos', '-', 'obligatorio', 2, 2, 4, '5'),
(41, 'Tecnología multimedia', '-', 'electivo', 2, 1, 3, '5'),
(42, 'Gestión de recursos humanos', '-', 'electivo', 2, 1, 3, '5'),
(43, 'Emprendimiento digital', '-', 'electivo', 2, 1, 3, '5'),
(44, 'Gestión financiera', '-', 'electivo', 2, 1, 3, '5'),
(45, 'Ingles tecnico II', '-', 'obligatorio', 2, 1, 3, '6'),
(46, 'Procesamiento de imagenes', '-', 'obligatorio', 2, 2, 4, '6'),
(47, 'Costos y presupuestos', '-', 'obligatorio', 2, 2, 4, '6'),
(48, 'Inteligencia de negocios', '-', 'obligatorio', 2, 2, 4, '6'),
(49, 'Diseño asistido por computadora', '-', 'obligatorio', 2, 1, 3, '6'),
(50, 'Lenguaje de programación IV', '-', 'obligatorio', 4, 2, 6, '6'),
(51, 'Arquitectura de computadoras', '-', 'obligatorio', 2, 2, 4, '6'),
(52, 'Redes y comunicaciones', '-', 'obligatorio', 2, 2, 4, '6'),
(53, 'Ingenieria de software', '-', 'obligatorio', 2, 3, 5, '7'),
(54, 'Sistemas de informacion empresarial', '-', 'obligatorio', 2, 3, 5, '7'),
(55, 'Sistemas operativos', '-', 'obligatorio', 2, 2, 4, '7'),
(56, 'Investigacion de operaciones', '-', 'obligatorio', 2, 2, 4, '7'),
(57, 'Lenguaje de programacion V', '-', 'obligatorio', 2, 2, 4, '7'),
(58, 'Gestion de proyectos', '-', 'obligatorio', 2, 2, 4, '7'),
(59, 'Computacion paralela', '-', 'electivo', 2, 1, 3, '7'),
(60, 'Computacion grafica', '-', 'electivo', 2, 1, 3, '7'),
(61, 'Bioinformatica', '-', 'electivo', 2, 1, 3, '7'),
(62, 'Computacion movil y ubicua', '-', 'electivo', 2, 1, 3, '7'),
(63, 'Investigacion, desarrollo e innovacion', '-', 'obligatorio', 2, 2, 4, '8'),
(64, 'Interaccion hombre maquina', '-', 'obligatorio', 2, 2, 4, '8'),
(65, 'Analisis y diseño de sistemas de informacion', '-', 'obligatorio', 2, 3, 5, '8'),
(66, 'Gestion de operaciones', '-', 'obligatorio', 2, 2, 4, '8'),
(67, 'Taller de software I', '-', 'obligatorio', 2, 2, 4, '8'),
(68, 'Ingles tecnico III', '-', 'obligatorio', 2, 1, 3, '8'),
(69, 'Inteligencia artificial', '-', 'obligatorio', 2, 2, 4, '8'),
(70, 'Sistemas de informacion georeferencial', '-', 'obligatorio', 2, 2, 4, '8'),
(71, 'Taller de software II', '-', 'obligatorio', 2, 2, 4, '9'),
(72, 'Robotica', '-', 'obligatorio', 2, 2, 4, '9'),
(73, 'Analisis y gestion de procesos', '-', 'obligatorio', 2, 2, 4, '9'),
(74, 'Gestion de servicios en tecnologia de informacion', '-', 'obligatorio', 2, 2, 4, '9'),
(75, 'Seminario de tesis', '-', 'obligatorio', 2, 2, 4, '9'),
(76, 'Arquitectura de sistemas de informacion', '-', 'obligatorio', 2, 2, 4, '9'),
(77, 'Seguridad informatica', '-', 'obligatorio', 2, 2, 4, '9'),
(78, 'Calidad de software', '-', 'electivo', 2, 1, 3, '9'),
(79, 'Peritaje informatico', '-', 'electivo', 2, 1, 3, '9'),
(80, 'Pedagogia informatica', '-', 'electivo', 2, 1, 3, '9'),
(81, 'Economia digital', '-', 'electivo', 2, 1, 3, '9'),
(82, 'Gerencia de sistemas de informacion', '-', 'obligatorio', 2, 2, 4, '10'),
(83, 'Practica preprofesional', '-', 'obligatorio', 4, 4, 8, '10'),
(84, 'Trabajo de investigacion', '-', 'obligatorio', 2, 2, 4, '10'),
(85, 'Auditoria informatica', '-', 'obligatorio', 2, 2, 4, '10');

-- --------------------------------------------------------

--
-- Table structure for table `cursoprofesorfijo`
--

CREATE TABLE `cursoprofesorfijo` (
  `idCursoProfesorFijo` int NOT NULL,
  `FK_idCurso` int NOT NULL,
  `FK_idProfesor` int NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_horario_curso`
--

CREATE TABLE `detalle_horario_curso` (
  `idDetalle_Horario_Curso` int NOT NULL,
  `FK_idHorarioCurso` int NOT NULL,
  `FK_idSalon` int NOT NULL,
  `dia` varchar(10) NOT NULL,
  `Hora_inicio` time NOT NULL,
  `Hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `horario`
--

CREATE TABLE `horario` (
  `idHorario` int NOT NULL,
  `año` year NOT NULL,
  `etapa` enum('I','II') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha` date DEFAULT NULL,
  `estado` enum('borrador','confirmado','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `horario_curso`
--

CREATE TABLE `horario_curso` (
  `idHorarioCurso` int NOT NULL,
  `FK_idProfesor` int NOT NULL,
  `FK_idCurso` int NOT NULL,
  `tipo` enum('regular','irregular') NOT NULL,
  `FK_idHorario` int NOT NULL,
  `Grupo` enum('1','2','3') NOT NULL,
  `Nr_estudiantes` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_10_03_053447_create_permission_tables', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 5),
(2, 'App\\Models\\User', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'crear_horario', 'web', '2025-10-11 04:44:44', '2025-10-11 04:44:45'),
(2, 'gest_profesores', 'web', '2025-10-11 04:45:04', '2025-10-11 04:45:05'),
(3, 'gest_cursos', 'web', '2025-10-11 04:45:15', '2025-10-11 04:45:16'),
(4, 'gest_salones', 'web', '2025-10-11 04:45:26', '2025-10-11 04:45:26'),
(5, 'gest_usuarios', 'web', '2025-10-11 04:45:42', '2025-10-11 04:45:42'),
(6, 'gest_roles', 'web', '2025-10-11 04:45:53', '2025-10-11 04:45:54'),
(7, 'admin.access', 'web', NULL, NULL),
(8, 'security.access', 'web', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(21, 'App\\Models\\User', 3, 'api_token', 'ff2ced9be83211d93c8ed894014a263d39faee7e8470a6c5544f115697087897', '[\"*\"]', NULL, NULL, '2025-10-09 03:16:16', '2025-10-09 03:16:16'),
(25, 'App\\Models\\User', 4, 'api_token', '085fbb545d312e7c863b731642e5ffe583e9183faa41c16328873ef663587183', '[\"*\"]', NULL, NULL, '2025-10-09 03:22:12', '2025-10-09 03:22:12'),
(47, 'App\\Models\\User', 6, 'api_token', 'dd2ffe557f0f2de52739d90b46b936712f761a1c673dfb6cf9016ac0ee570f6d', '[\"*\"]', NULL, NULL, '2025-10-11 10:53:25', '2025-10-11 10:53:25'),
(48, 'App\\Models\\User', 5, 'api_token', '2b1dbe67c019ce45d211699e19259ef349a8f04b3e91e4a7fd01cbcf6f478c2c', '[\"*\"]', NULL, NULL, '2025-10-11 10:53:42', '2025-10-11 10:53:42');

-- --------------------------------------------------------

--
-- Table structure for table `profesor`
--

CREATE TABLE `profesor` (
  `idProfesor` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `FK_user_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profesor`
--

INSERT INTO `profesor` (`idProfesor`, `nombre`, `apellido`, `dni`, `correo`, `FK_user_id`) VALUES
(1, 'Luis Honorato', 'Pita Astengo', '71248521', 'ejemplo1@gmail.com', NULL),
(2, 'Juan Manuel', 'Verme Insua', '75440821', 'ejemplo2@gmail.com', NULL),
(3, 'Angel Idelfonso', 'Catashunga Torres', '75938521', 'ejemplo3@gmail.com', NULL),
(4, 'Manuel', 'Tuesta Moreno', '75788521', 'ejemplo4@gmail.com', NULL),
(5, 'Carlos', 'Gonzales Aspajo', '75558521', 'ejemplo5@gmail.com', NULL),
(6, 'Saul', 'Flores Nunta', '75998521', 'ejemplo6@gmail.com', NULL),
(7, 'Angel Enrique', 'Lopez Rojas', '75208521', 'ejemplo7@gmail.com', NULL),
(8, 'Jose Edgar', 'Garcia Diaz', '75401521', 'ejemplo8@gmail.com', NULL),
(9, 'Rafael', 'Vilca Barbaran', '75448500', 'ejemplo9@gmail.com', NULL),
(10, 'Richard Alex', 'Lopez Albiño', '75008521', 'ejemplo10@gmail.com', NULL),
(11, 'Jimmy Max', 'Ramirez Villacorta', '71448521', 'ejemplo11@gmail.com', NULL),
(12, 'Tony Eduardo', 'Bardales Lozano', '72448521', 'ejemplo12@gmail.com', NULL),
(13, 'Francisco Miguel', 'Ruiz Hidalgo', '73448521', 'ejemplo13@gmail.com', NULL),
(14, 'Angel Alberto', 'Marthans Ruiz', '75458521', 'ejemplo14@gmail.com', NULL),
(15, 'Paul', 'Escobar Cardeña', '74448521', 'ejemplo15@gmail.com', NULL),
(16, 'Ronald Percy', 'Melchor Infantes', '75468521', 'ejemplo16@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2025-10-11 03:50:21', '2025-10-11 03:50:21'),
(2, 'profesor', 'web', '2025-10-11 03:50:22', '2025-10-11 03:50:23');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `salon`
--

CREATE TABLE `salon` (
  `idSalon` int NOT NULL,
  `tipo` enum('laboratorio','normal') NOT NULL,
  `capacidad` int NOT NULL,
  `disponibilidad` enum('habilitado','deshabilitado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `salon`
--

INSERT INTO `salon` (`idSalon`, `tipo`, `capacidad`, `disponibilidad`) VALUES
(1, 'normal', 40, 'habilitado'),
(2, 'normal', 40, 'habilitado'),
(3, 'normal', 40, 'habilitado'),
(4, 'normal', 40, 'habilitado'),
(5, 'normal', 40, 'habilitado'),
(6, 'laboratorio', 30, 'habilitado'),
(7, 'laboratorio', 30, 'habilitado');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Admin', 'admin2@gmail.com', '$2y$12$eyiSqOMx14AMLCnnhA.7rOi5Di/RcL3f8YaGJbI2i9t5Ox9Fvfaqa', NULL, '2025-10-03 11:41:37', '2025-10-03 11:41:37'),
(5, 'Danfer', '21131B0737@unap.edu.pe', '$2y$12$GDQ.dXMkHC1a.GLCWQ/rTODOYO3kknAly5AD7Sms/zclAFM6RCA0i', NULL, '2025-10-08 22:22:56', '2025-10-08 22:22:56'),
(6, 'Picolo Parker', 'picolo@unap.edu.pe', '$2y$12$ll5jg6/dyoMmE4MmJ2eH1OZ0kie1HJjbDb5Lc9AGKs7BkSTC5b0oC', NULL, '2025-10-11 09:53:09', '2025-10-11 09:53:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`idCurso`);

--
-- Indexes for table `cursoprofesorfijo`
--
ALTER TABLE `cursoprofesorfijo`
  ADD PRIMARY KEY (`idCursoProfesorFijo`),
  ADD KEY `FK_CPF_Curso` (`FK_idCurso`),
  ADD KEY `FK_CPF_Profesor` (`FK_idProfesor`);

--
-- Indexes for table `detalle_horario_curso`
--
ALTER TABLE `detalle_horario_curso`
  ADD PRIMARY KEY (`idDetalle_Horario_Curso`),
  ADD KEY `FK_idHorarioCurso` (`FK_idHorarioCurso`),
  ADD KEY `FK_idSalon` (`FK_idSalon`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`idHorario`);

--
-- Indexes for table `horario_curso`
--
ALTER TABLE `horario_curso`
  ADD PRIMARY KEY (`idHorarioCurso`),
  ADD KEY `FK_idProfesor` (`FK_idProfesor`),
  ADD KEY `FK_idCurso` (`FK_idCurso`),
  ADD KEY `FK_idHorario` (`FK_idHorario`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`idProfesor`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_profesor_user` (`FK_user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `salon`
--
ALTER TABLE `salon`
  ADD PRIMARY KEY (`idSalon`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `curso`
--
ALTER TABLE `curso`
  MODIFY `idCurso` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `cursoprofesorfijo`
--
ALTER TABLE `cursoprofesorfijo`
  MODIFY `idCursoProfesorFijo` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horario`
--
ALTER TABLE `horario`
  MODIFY `idHorario` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horario_curso`
--
ALTER TABLE `horario_curso`
  MODIFY `idHorarioCurso` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `profesor`
--
ALTER TABLE `profesor`
  MODIFY `idProfesor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=227;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `salon`
--
ALTER TABLE `salon`
  MODIFY `idSalon` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cursoprofesorfijo`
--
ALTER TABLE `cursoprofesorfijo`
  ADD CONSTRAINT `FK_CPF_Curso` FOREIGN KEY (`FK_idCurso`) REFERENCES `curso` (`idCurso`),
  ADD CONSTRAINT `FK_CPF_Profesor` FOREIGN KEY (`FK_idProfesor`) REFERENCES `profesor` (`idProfesor`);

--
-- Constraints for table `detalle_horario_curso`
--
ALTER TABLE `detalle_horario_curso`
  ADD CONSTRAINT `FK_idHorarioCurso` FOREIGN KEY (`FK_idHorarioCurso`) REFERENCES `horario_curso` (`idHorarioCurso`),
  ADD CONSTRAINT `FK_idSalon` FOREIGN KEY (`FK_idSalon`) REFERENCES `salon` (`idSalon`);

--
-- Constraints for table `horario_curso`
--
ALTER TABLE `horario_curso`
  ADD CONSTRAINT `FK_idCurso` FOREIGN KEY (`FK_idCurso`) REFERENCES `curso` (`idCurso`),
  ADD CONSTRAINT `FK_idHorario` FOREIGN KEY (`FK_idHorario`) REFERENCES `horario` (`idHorario`),
  ADD CONSTRAINT `FK_idProfesor` FOREIGN KEY (`FK_idProfesor`) REFERENCES `profesor` (`idProfesor`);

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profesor`
--
ALTER TABLE `profesor`
  ADD CONSTRAINT `fk_profesor_user` FOREIGN KEY (`FK_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
