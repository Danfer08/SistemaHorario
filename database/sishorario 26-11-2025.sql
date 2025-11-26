-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2025 at 05:07 PM
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
-- Database: `sishorarioversion`
--
CREATE DATABASE IF NOT EXISTS `sishorario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `sishorario`;

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
(85, 'Auditoria informatica', '-', 'obligatorio', 2, 2, 4, '10'),
(151, 'ss', NULL, 'obligatorio', 0, 0, 0, '1');

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

--
-- Dumping data for table `detalle_horario_curso`
--

INSERT INTO `detalle_horario_curso` (`idDetalle_Horario_Curso`, `FK_idHorarioCurso`, `FK_idSalon`, `dia`, `Hora_inicio`, `Hora_fin`) VALUES
(1, 13, 1, 'Lunes', '12:00:00', '14:00:00'),
(2, 14, 1, 'Lunes', '07:00:00', '12:00:00'),
(3, 15, 2, 'Martes', '08:00:00', '12:00:00'),
(4, 16, 3, 'Miércoles', '08:00:00', '12:00:00'),
(5, 17, 4, 'Viernes', '09:00:00', '11:00:00'),
(6, 18, 5, 'Jueves', '11:00:00', '13:00:00'),
(7, 19, 4, 'Lunes', '17:00:00', '20:00:00'),
(8, 20, 4, 'Martes', '17:00:00', '21:00:00'),
(9, 21, 3, 'Miércoles', '17:00:00', '20:00:00'),
(14, 26, 6, 'Martes', '07:00:00', '12:00:00'),
(51, 58, 1, 'Miércoles', '08:00:00', '13:00:00'),
(53, 60, 1, 'Martes', '17:00:00', '22:00:00'),
(54, 61, 3, 'Jueves', '18:00:00', '23:00:00'),
(59, 64, 1, 'Viernes', '12:00:00', '15:00:00'),
(60, 65, 6, 'Lunes', '12:00:00', '15:00:00'),
(61, 66, 6, 'Jueves', '09:00:00', '13:00:00'),
(62, 67, 1, 'Miércoles', '14:00:00', '19:00:00'),
(63, 68, 7, 'Sábado', '18:00:00', '20:00:00'),
(64, 69, 1, 'Sábado', '20:00:00', '22:00:00'),
(66, 71, 4, 'Lunes', '07:00:00', '12:00:00'),
(67, 72, 1, 'Lunes', '12:00:00', '15:00:00'),
(68, 73, 4, 'Lunes', '15:00:00', '19:00:00'),
(69, 74, 1, 'Sábado', '09:00:00', '13:00:00'),
(70, 75, 3, 'Sábado', '13:00:00', '15:00:00'),
(71, 75, 1, 'Sábado', '15:00:00', '17:00:00'),
(72, 76, 6, 'Martes', '12:00:00', '17:00:00'),
(73, 77, 3, 'Sábado', '17:00:00', '21:00:00'),
(74, 78, 3, 'Lunes', '07:00:00', '10:00:00'),
(75, 79, 5, 'Lunes', '10:00:00', '14:00:00'),
(76, 80, 6, 'Lunes', '15:00:00', '19:00:00'),
(77, 81, 3, 'Lunes', '19:00:00', '23:00:00'),
(78, 82, 5, 'Martes', '07:00:00', '13:00:00'),
(79, 83, 7, 'Martes', '13:00:00', '16:00:00'),
(80, 84, 7, 'Miércoles', '13:00:00', '16:00:00'),
(81, 85, 2, 'Martes', '16:00:00', '20:00:00'),
(82, 86, 3, 'Miércoles', '07:00:00', '11:00:00'),
(83, 87, 2, 'Sábado', '07:00:00', '11:00:00'),
(84, 88, 4, 'Sábado', '11:00:00', '15:00:00'),
(85, 89, 4, 'Martes', '09:00:00', '14:00:00'),
(86, 90, 3, 'Miércoles', '14:00:00', '17:00:00'),
(87, 91, 6, 'Lunes', '07:00:00', '11:00:00'),
(88, 92, 4, 'Miércoles', '10:00:00', '14:00:00'),
(89, 93, 2, 'Miércoles', '07:00:00', '09:00:00'),
(90, 93, 2, 'Jueves', '07:00:00', '09:00:00'),
(91, 94, 5, 'Jueves', '10:00:00', '14:00:00'),
(93, 96, 2, 'Lunes', '19:00:00', '23:00:00'),
(94, 97, 4, 'Miércoles', '14:00:00', '22:00:00'),
(95, 98, 5, 'Jueves', '14:00:00', '22:00:00'),
(96, 99, 6, 'Viernes', '14:00:00', '22:00:00'),
(97, 100, 3, 'Martes', '08:00:00', '12:00:00'),
(98, 101, 3, 'Martes', '13:00:00', '17:00:00'),
(102, 104, 2, 'Martes', '12:00:00', '17:00:00'),
(103, 105, 2, 'Miércoles', '10:00:00', '13:00:00'),
(104, 105, 5, 'Miércoles', '16:00:00', '18:00:00'),
(105, 106, 4, 'Lunes', '11:00:00', '16:00:00'),
(106, 107, 1, 'Martes', '09:00:00', '12:00:00'),
(107, 107, 3, 'Martes', '12:00:00', '13:00:00'),
(108, 108, 3, 'Miércoles', '09:00:00', '12:00:00'),
(109, 108, 6, 'Miércoles', '12:00:00', '13:00:00'),
(1974, 1126, 1, 'Lunes', '07:00:00', '11:00:00'),
(1975, 1126, 1, 'Martes', '07:00:00', '11:00:00'),
(1976, 1127, 1, 'Lunes', '11:00:00', '14:00:00'),
(1977, 1127, 1, 'Martes', '11:00:00', '13:00:00'),
(1978, 1128, 1, 'Lunes', '14:00:00', '17:00:00'),
(1979, 1128, 1, 'Martes', '13:00:00', '15:00:00'),
(1980, 1129, 1, 'Lunes', '17:00:00', '20:00:00'),
(1981, 1129, 1, 'Martes', '15:00:00', '17:00:00'),
(1982, 1130, 1, 'Martes', '17:00:00', '20:00:00'),
(1983, 1130, 1, 'Lunes', '20:00:00', '22:00:00'),
(1984, 1131, 1, 'Miércoles', '07:00:00', '10:00:00'),
(1985, 1131, 1, 'Martes', '20:00:00', '22:00:00'),
(1986, 1132, 1, 'Miércoles', '10:00:00', '13:00:00'),
(1987, 1132, 1, 'Jueves', '07:00:00', '09:00:00'),
(1988, 1133, 2, 'Lunes', '07:00:00', '09:00:00'),
(1989, 1133, 2, 'Martes', '07:00:00', '09:00:00'),
(1990, 1134, 2, 'Lunes', '09:00:00', '11:00:00'),
(1991, 1134, 2, 'Martes', '09:00:00', '11:00:00'),
(1992, 1135, 2, 'Lunes', '17:00:00', '19:00:00'),
(1993, 1135, 2, 'Martes', '15:00:00', '17:00:00'),
(1994, 1136, 2, 'Lunes', '11:00:00', '13:00:00'),
(1995, 1136, 2, 'Martes', '11:00:00', '13:00:00'),
(1996, 1137, 2, 'Lunes', '13:00:00', '15:00:00'),
(1997, 1137, 2, 'Martes', '13:00:00', '15:00:00'),
(1998, 1138, 2, 'Lunes', '15:00:00', '17:00:00'),
(1999, 1138, 2, 'Martes', '20:00:00', '22:00:00'),
(2000, 1139, 2, 'Miércoles', '07:00:00', '09:00:00'),
(2001, 1139, 2, 'Jueves', '07:00:00', '09:00:00'),
(2002, 1140, 2, 'Miércoles', '09:00:00', '11:00:00'),
(2003, 1140, 1, 'Jueves', '09:00:00', '11:00:00'),
(2004, 1141, 2, 'Lunes', '19:00:00', '21:00:00'),
(2005, 1141, 2, 'Martes', '17:00:00', '19:00:00'),
(2006, 1142, 2, 'Miércoles', '11:00:00', '13:00:00'),
(2007, 1142, 1, 'Jueves', '11:00:00', '13:00:00'),
(2008, 1143, 3, 'Lunes', '11:00:00', '13:00:00'),
(2009, 1143, 3, 'Martes', '11:00:00', '13:00:00'),
(2010, 1144, 3, 'Lunes', '07:00:00', '09:00:00'),
(2011, 1144, 3, 'Martes', '07:00:00', '09:00:00'),
(2012, 1145, 3, 'Lunes', '09:00:00', '11:00:00'),
(2013, 1145, 3, 'Martes', '09:00:00', '11:00:00'),
(2014, 1146, 3, 'Lunes', '13:00:00', '15:00:00'),
(2015, 1146, 3, 'Martes', '13:00:00', '15:00:00'),
(2016, 1147, 3, 'Lunes', '15:00:00', '17:00:00'),
(2017, 1147, 3, 'Martes', '15:00:00', '17:00:00'),
(2018, 1148, 3, 'Lunes', '17:00:00', '19:00:00'),
(2019, 1148, 3, 'Martes', '17:00:00', '19:00:00'),
(2020, 1149, 3, 'Lunes', '19:00:00', '21:00:00'),
(2021, 1149, 3, 'Martes', '19:00:00', '21:00:00'),
(2022, 1150, 3, 'Miércoles', '07:00:00', '09:00:00'),
(2023, 1150, 3, 'Jueves', '07:00:00', '09:00:00'),
(2024, 1151, 3, 'Miércoles', '09:00:00', '11:00:00'),
(2025, 1151, 2, 'Jueves', '09:00:00', '11:00:00'),
(2026, 1152, 3, 'Miércoles', '11:00:00', '13:00:00'),
(2027, 1152, 2, 'Jueves', '11:00:00', '13:00:00'),
(2028, 1153, 4, 'Lunes', '07:00:00', '09:00:00'),
(2029, 1153, 4, 'Martes', '07:00:00', '09:00:00'),
(2030, 1154, 4, 'Lunes', '09:00:00', '11:00:00'),
(2031, 1154, 4, 'Martes', '09:00:00', '11:00:00'),
(2032, 1155, 4, 'Lunes', '19:00:00', '20:00:00'),
(2033, 1155, 4, 'Martes', '17:00:00', '19:00:00'),
(2034, 1156, 4, 'Lunes', '20:00:00', '21:00:00'),
(2035, 1156, 4, 'Martes', '19:00:00', '21:00:00'),
(2036, 1157, 4, 'Lunes', '13:00:00', '14:00:00'),
(2037, 1157, 4, 'Martes', '13:00:00', '15:00:00'),
(2038, 1158, 4, 'Lunes', '14:00:00', '15:00:00'),
(2039, 1158, 4, 'Martes', '15:00:00', '17:00:00'),
(2040, 1159, 4, 'Lunes', '15:00:00', '16:00:00'),
(2041, 1159, 4, 'Miércoles', '07:00:00', '09:00:00'),
(2042, 1160, 4, 'Lunes', '16:00:00', '17:00:00'),
(2043, 1160, 4, 'Miércoles', '09:00:00', '11:00:00'),
(2044, 1161, 1, 'Miércoles', '13:00:00', '14:00:00'),
(2045, 1162, 1, 'Lunes', '07:00:00', '11:00:00'),
(2046, 1162, 1, 'Martes', '07:00:00', '11:00:00'),
(2047, 1163, 1, 'Lunes', '11:00:00', '13:00:00'),
(2048, 1163, 1, 'Martes', '11:00:00', '15:00:00'),
(2049, 1164, 1, 'Lunes', '13:00:00', '16:00:00'),
(2050, 1164, 1, 'Martes', '15:00:00', '17:00:00'),
(2051, 1165, 1, 'Lunes', '16:00:00', '19:00:00'),
(2052, 1165, 1, 'Martes', '17:00:00', '19:00:00'),
(2053, 1166, 1, 'Lunes', '19:00:00', '22:00:00'),
(2054, 1166, 1, 'Martes', '19:00:00', '21:00:00'),
(2055, 1167, 1, 'Miércoles', '07:00:00', '10:00:00'),
(2056, 1167, 1, 'Jueves', '07:00:00', '09:00:00'),
(2057, 1168, 1, 'Miércoles', '10:00:00', '13:00:00'),
(2058, 1168, 1, 'Jueves', '09:00:00', '11:00:00'),
(2059, 1169, 2, 'Lunes', '07:00:00', '10:00:00'),
(2060, 1169, 2, 'Martes', '07:00:00', '09:00:00'),
(2061, 1170, 2, 'Lunes', '10:00:00', '13:00:00'),
(2062, 1170, 2, 'Martes', '09:00:00', '11:00:00'),
(2063, 1171, 2, 'Martes', '11:00:00', '13:00:00'),
(2064, 1171, 2, 'Miércoles', '10:00:00', '12:00:00'),
(2065, 1172, 2, 'Lunes', '13:00:00', '15:00:00'),
(2066, 1172, 2, 'Martes', '13:00:00', '15:00:00'),
(2067, 1173, 2, 'Lunes', '15:00:00', '17:00:00'),
(2068, 1173, 2, 'Martes', '15:00:00', '17:00:00'),
(2069, 1174, 2, 'Lunes', '17:00:00', '19:00:00'),
(2070, 1174, 2, 'Martes', '17:00:00', '19:00:00'),
(2071, 1175, 2, 'Lunes', '19:00:00', '21:00:00'),
(2072, 1175, 2, 'Martes', '19:00:00', '21:00:00'),
(2073, 1176, 2, 'Miércoles', '07:00:00', '09:00:00'),
(2074, 1176, 2, 'Jueves', '07:00:00', '09:00:00'),
(2075, 1177, 2, 'Miércoles', '12:00:00', '14:00:00'),
(2076, 1177, 2, 'Jueves', '09:00:00', '11:00:00'),
(2077, 1178, 3, 'Lunes', '07:00:00', '09:00:00'),
(2078, 1178, 3, 'Martes', '07:00:00', '09:00:00'),
(2079, 1179, 3, 'Lunes', '09:00:00', '11:00:00'),
(2080, 1179, 3, 'Martes', '09:00:00', '11:00:00'),
(2081, 1180, 3, 'Lunes', '13:00:00', '15:00:00'),
(2082, 1180, 3, 'Martes', '15:00:00', '17:00:00'),
(2083, 1181, 3, 'Lunes', '15:00:00', '17:00:00'),
(2084, 1181, 3, 'Martes', '11:00:00', '13:00:00'),
(2085, 1182, 3, 'Lunes', '17:00:00', '19:00:00'),
(2086, 1182, 3, 'Martes', '13:00:00', '15:00:00'),
(2087, 1183, 3, 'Lunes', '19:00:00', '21:00:00'),
(2088, 1183, 3, 'Martes', '17:00:00', '19:00:00'),
(2089, 1184, 3, 'Martes', '19:00:00', '21:00:00'),
(2090, 1184, 3, 'Miércoles', '07:00:00', '09:00:00'),
(2091, 1185, 3, 'Miércoles', '09:00:00', '11:00:00'),
(2092, 1185, 3, 'Jueves', '07:00:00', '09:00:00'),
(2093, 1186, 3, 'Miércoles', '11:00:00', '13:00:00'),
(2094, 1186, 3, 'Jueves', '09:00:00', '11:00:00'),
(2095, 1187, 3, 'Lunes', '11:00:00', '13:00:00'),
(2096, 1187, 1, 'Miércoles', '13:00:00', '15:00:00'),
(2097, 1188, 4, 'Lunes', '13:00:00', '15:00:00'),
(2098, 1188, 4, 'Martes', '11:00:00', '13:00:00'),
(2099, 1189, 4, 'Lunes', '15:00:00', '17:00:00'),
(2100, 1189, 4, 'Martes', '13:00:00', '15:00:00'),
(2101, 1190, 4, 'Lunes', '07:00:00', '08:00:00'),
(2102, 1190, 4, 'Martes', '07:00:00', '09:00:00'),
(2103, 1191, 4, 'Lunes', '08:00:00', '09:00:00'),
(2104, 1191, 4, 'Martes', '09:00:00', '11:00:00'),
(2105, 1192, 4, 'Lunes', '10:00:00', '11:00:00'),
(2106, 1192, 4, 'Miércoles', '07:00:00', '09:00:00'),
(2107, 1193, 4, 'Lunes', '17:00:00', '18:00:00'),
(2108, 1193, 4, 'Martes', '17:00:00', '19:00:00'),
(2109, 1194, 4, 'Lunes', '18:00:00', '19:00:00'),
(2110, 1194, 4, 'Martes', '19:00:00', '21:00:00'),
(2111, 1195, 4, 'Lunes', '09:00:00', '10:00:00'),
(2112, 1195, 4, 'Martes', '15:00:00', '17:00:00');

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

--
-- Dumping data for table `horario`
--

INSERT INTO `horario` (`idHorario`, `año`, `etapa`, `fecha`, `estado`) VALUES
(1, 2025, 'I', '2025-11-01', 'confirmado'),
(2, 2025, 'II', '2025-11-01', 'confirmado'),
(6, 2026, 'I', '2025-11-03', 'confirmado'),
(62, 2027, 'I', '2025-11-25', 'borrador'),
(63, 2027, 'II', '2025-11-25', 'borrador');

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
  `Grupo` enum('1','2','3','4') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Nr_estudiantes` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `horario_curso`
--

INSERT INTO `horario_curso` (`idHorarioCurso`, `FK_idProfesor`, `FK_idCurso`, `tipo`, `FK_idHorario`, `Grupo`, `Nr_estudiantes`) VALUES
(13, 2, 1, 'regular', 1, '1', 1),
(14, 2, 2, 'regular', 1, '1', 12),
(15, 2, 4, 'regular', 1, '1', 12),
(16, 3, 6, 'regular', 1, '1', 12),
(17, 10, 9, 'regular', 1, '1', 23),
(18, 8, 8, 'regular', 1, '1', 23),
(19, 12, 3, 'regular', 1, '1', 12),
(20, 7, 5, 'regular', 1, '1', 23),
(21, 8, 7, 'regular', 1, '1', 12),
(26, 10, 14, 'regular', 2, '1', 21),
(58, 5, 12, 'regular', 2, '1', 23),
(60, 1, 10, 'regular', 2, '1', 23),
(61, 14, 10, 'regular', 2, '2', 23),
(64, 13, 11, 'regular', 2, '1', 23),
(65, 8, 15, 'regular', 2, '1', 30),
(66, 11, 13, 'regular', 2, '1', 23),
(67, 8, 16, 'regular', 2, '1', 23),
(68, 9, 17, 'regular', 2, '1', 23),
(69, 7, 18, 'regular', 2, '1', 12),
(71, 10, 26, 'regular', 2, '1', 32),
(72, 12, 28, 'regular', 2, '1', 21),
(73, 13, 27, 'regular', 2, '1', 34),
(74, 6, 29, 'regular', 2, '1', 23),
(75, 4, 30, 'regular', 2, '1', 12),
(76, 10, 31, 'regular', 2, '1', 23),
(77, 14, 32, 'regular', 2, '1', 23),
(78, 11, 45, 'regular', 2, '1', 32),
(79, 4, 46, 'regular', 2, '1', 23),
(80, 3, 47, 'regular', 2, '1', 30),
(81, 15, 48, 'regular', 2, '1', 30),
(82, 9, 50, 'regular', 2, '1', 30),
(83, 1, 49, 'regular', 2, '1', 21),
(84, 12, 49, 'regular', 2, '2', 23),
(85, 14, 51, 'regular', 2, '1', 25),
(86, 14, 52, 'regular', 2, '1', 23),
(87, 12, 63, 'regular', 2, '1', 1),
(88, 13, 64, 'regular', 2, '1', 1),
(89, 8, 65, 'regular', 2, '1', 1),
(90, 11, 68, 'regular', 2, '1', 1),
(91, 3, 66, 'regular', 2, '1', 1),
(92, 8, 67, 'regular', 2, '1', 1),
(93, 11, 69, 'regular', 2, '1', 1),
(94, 13, 70, 'regular', 2, '1', 1),
(96, 14, 82, 'regular', 2, '1', 1),
(97, 1, 83, 'regular', 2, '1', 1),
(98, 4, 83, 'regular', 2, '2', 1),
(99, 16, 83, 'regular', 2, '3', 1),
(100, 12, 84, 'regular', 2, '1', 1),
(101, 11, 85, 'regular', 2, '1', 1),
(104, 6, 1, 'regular', 6, '1', 1),
(105, 2, 1, 'regular', 6, '2', 1),
(106, 9, 1, 'regular', 6, '3', 1),
(107, 16, 19, 'regular', 6, '1', 1),
(108, 16, 19, 'regular', 6, '2', 1),
(1126, 1, 37, 'regular', 62, '1', 30),
(1127, 1, 2, 'regular', 62, '1', 30),
(1128, 1, 1, 'regular', 62, '1', 30),
(1129, 1, 20, 'regular', 62, '1', 30),
(1130, 1, 24, 'regular', 62, '1', 30),
(1131, 1, 53, 'regular', 62, '1', 30),
(1132, 1, 54, 'regular', 62, '1', 30),
(1133, 2, 4, 'regular', 62, '1', 30),
(1134, 2, 5, 'regular', 62, '1', 30),
(1135, 2, 6, 'regular', 62, '1', 30),
(1136, 2, 19, 'regular', 62, '1', 30),
(1137, 2, 21, 'regular', 62, '1', 30),
(1138, 2, 22, 'regular', 62, '1', 30),
(1139, 2, 23, 'regular', 62, '1', 30),
(1140, 2, 25, 'regular', 62, '1', 30),
(1141, 2, 33, 'regular', 62, '1', 30),
(1142, 2, 40, 'regular', 62, '1', 30),
(1143, 3, 36, 'regular', 62, '1', 30),
(1144, 3, 55, 'regular', 62, '1', 30),
(1145, 3, 56, 'regular', 62, '1', 30),
(1146, 3, 57, 'regular', 62, '1', 30),
(1147, 3, 58, 'regular', 62, '1', 30),
(1148, 3, 71, 'regular', 62, '1', 30),
(1149, 3, 72, 'regular', 62, '1', 30),
(1150, 3, 73, 'regular', 62, '1', 30),
(1151, 3, 74, 'regular', 62, '1', 30),
(1152, 3, 75, 'regular', 62, '1', 30),
(1153, 4, 76, 'regular', 62, '1', 30),
(1154, 4, 77, 'regular', 62, '1', 30),
(1155, 4, 3, 'regular', 62, '1', 30),
(1156, 4, 7, 'regular', 62, '1', 30),
(1157, 4, 39, 'regular', 62, '1', 30),
(1158, 4, 34, 'regular', 62, '1', 30),
(1159, 4, 35, 'regular', 62, '1', 30),
(1160, 4, 38, 'regular', 62, '1', 30),
(1161, 1, 151, 'regular', 62, '1', 30),
(1162, 1, 83, 'regular', 63, '1', 30),
(1163, 1, 50, 'regular', 63, '1', 30),
(1164, 1, 10, 'regular', 63, '1', 30),
(1165, 1, 12, 'regular', 63, '1', 30),
(1166, 1, 14, 'regular', 63, '1', 30),
(1167, 1, 16, 'regular', 63, '1', 30),
(1168, 1, 26, 'regular', 63, '1', 30),
(1169, 2, 31, 'regular', 63, '1', 30),
(1170, 2, 65, 'regular', 63, '1', 30),
(1171, 2, 13, 'regular', 63, '1', 30),
(1172, 2, 27, 'regular', 63, '1', 30),
(1173, 2, 29, 'regular', 63, '1', 30),
(1174, 2, 30, 'regular', 63, '1', 30),
(1175, 2, 32, 'regular', 63, '1', 30),
(1176, 2, 52, 'regular', 63, '1', 30),
(1177, 2, 46, 'regular', 63, '1', 30),
(1178, 3, 47, 'regular', 63, '1', 30),
(1179, 3, 48, 'regular', 63, '1', 30),
(1180, 3, 51, 'regular', 63, '1', 30),
(1181, 3, 63, 'regular', 63, '1', 30),
(1182, 3, 64, 'regular', 63, '1', 30),
(1183, 3, 66, 'regular', 63, '1', 30),
(1184, 3, 67, 'regular', 63, '1', 30),
(1185, 3, 69, 'regular', 63, '1', 30),
(1186, 3, 70, 'regular', 63, '1', 30),
(1187, 3, 82, 'regular', 63, '1', 30),
(1188, 4, 84, 'regular', 63, '1', 30),
(1189, 4, 85, 'regular', 63, '1', 30),
(1190, 4, 11, 'regular', 63, '1', 30),
(1191, 4, 15, 'regular', 63, '1', 30),
(1192, 4, 28, 'regular', 63, '1', 30),
(1193, 4, 49, 'regular', 63, '1', 30),
(1194, 4, 45, 'regular', 63, '1', 30),
(1195, 4, 68, 'regular', 63, '1', 30);

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
(5, '2025_10_03_053447_create_permission_tables', 1),
(7, '2025_11_25_032424_add_equipamiento_to_salon_table', 2),
(8, '2025_11_25_040222_add_columns_to_profesor_table', 3);

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
(2, 'App\\Models\\User', 9),
(2, 'App\\Models\\User', 10),
(2, 'App\\Models\\User', 11),
(2, 'App\\Models\\User', 12),
(2, 'App\\Models\\User', 13),
(2, 'App\\Models\\User', 14),
(2, 'App\\Models\\User', 15),
(2, 'App\\Models\\User', 16),
(2, 'App\\Models\\User', 17),
(2, 'App\\Models\\User', 18),
(2, 'App\\Models\\User', 19),
(2, 'App\\Models\\User', 20),
(2, 'App\\Models\\User', 21),
(2, 'App\\Models\\User', 22),
(2, 'App\\Models\\User', 23),
(2, 'App\\Models\\User', 24),
(1, 'App\\Models\\User', 25);

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
(8, 'security.access', 'web', NULL, NULL),
(9, 'ver-roles', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(10, 'crear-roles', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(11, 'editar-roles', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(12, 'eliminar-roles', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(13, 'ver-usuarios', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(14, 'crear-usuarios', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(15, 'editar-usuarios', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(16, 'eliminar-usuarios', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32');

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
(82, 'App\\Models\\User', 6, 'api_token', '61601313437b28505b4fd614f4e23ba912cc35e5dea4422b1fddbe79b477341c', '[\"*\"]', '2025-11-03 23:14:09', NULL, '2025-11-03 22:52:09', '2025-11-03 23:14:09'),
(94, 'App\\Models\\User', 9, 'api_token', 'aa2f451f7f97880b064ac4f399b58d19cf22ea616a293b9304ce2427649db707', '[\"*\"]', '2025-11-04 11:02:42', NULL, '2025-11-04 09:05:15', '2025-11-04 11:02:42'),
(106, 'App\\Models\\User', 5, 'api_token', '35cfc4479269f4b3d09ef3477eb1b5da06bfd5386f7f12224f225bc755c13108', '[\"*\"]', '2025-11-26 22:03:54', NULL, '2025-11-26 22:00:50', '2025-11-26 22:03:54');

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
  `telefono` varchar(20) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT 'ordinario',
  `estado` varchar(20) NOT NULL DEFAULT 'activo',
  `FK_user_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profesor`
--

INSERT INTO `profesor` (`idProfesor`, `nombre`, `apellido`, `dni`, `correo`, `telefono`, `categoria`, `estado`, `FK_user_id`) VALUES
(1, 'Luis Honorato', 'Pita Astengo', '71248521', 'ejemplo1@gmail.com', NULL, 'ordinario', 'activo', 9),
(2, 'Juan Manuel', 'Verme Insua', '75440821', 'ejemplo2@gmail.com', NULL, 'ordinario', 'activo', 10),
(3, 'Angel Idelfonso', 'Catashunga Torres', '75938521', 'ejemplo3@gmail.com', NULL, 'ordinario', 'activo', 11),
(4, 'Manuel', 'Tuesta Moreno', '75788521', 'ejemplo4@gmail.com', NULL, 'ordinario', 'activo', 12),
(5, 'Carlos', 'Gonzales Aspajo', '75558521', 'ejemplo5@gmail.com', NULL, 'ordinario', 'activo', 13),
(6, 'Saul', 'Flores Nunta', '75998521', 'ejemplo6@gmail.com', NULL, 'ordinario', 'activo', 14),
(7, 'Angel Enrique', 'Lopez Rojas', '75208521', 'ejemplo7@gmail.com', NULL, 'ordinario', 'activo', 15),
(8, 'Jose Edgar', 'Garcia Diaz', '75401521', 'ejemplo8@gmail.com', NULL, 'ordinario', 'activo', 16),
(9, 'Rafael', 'Vilca Barbaran', '75448500', 'ejemplo9@gmail.com', NULL, 'ordinario', 'activo', 17),
(10, 'Richard Alex', 'Lopez Albiño', '75008521', 'ejemplo10@gmail.com', NULL, 'ordinario', 'activo', 18),
(11, 'Jimmy Max', 'Ramirez Villacorta', '71448521', 'ejemplo11@gmail.com', NULL, 'ordinario', 'activo', 19),
(12, 'Tony Eduardo', 'Bardales Lozano', '72448521', 'ejemplo12@gmail.com', NULL, 'ordinario', 'activo', 20),
(13, 'Francisco Miguel', 'Ruiz Hidalgo', '73448521', 'ejemplo13@gmail.com', NULL, 'ordinario', 'activo', 21),
(14, 'Angel Alberto', 'Marthans Ruiz', '75458521', 'ejemplo14@gmail.com', NULL, 'ordinario', 'activo', 22),
(15, 'Paul', 'Escobar Cardeña', '74448521', 'ejemplo15@gmail.com', NULL, 'ordinario', 'activo', 23),
(16, 'Ronald Percy', 'Melchor Infantes', '75468521', 'ejemplo16@gmail.com', NULL, 'ordinario', 'activo', 24);

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
(2, 'profesor', 'web', '2025-10-11 03:50:22', '2025-10-11 03:50:23'),
(4, 'www', 'web', '2025-11-05 20:59:06', '2025-11-05 20:59:06'),
(5, 'sss', 'web', '2025-11-05 20:59:18', '2025-11-05 20:59:18'),
(6, 'Administrador', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(7, 'Usuario', 'web', '2025-11-05 21:28:32', '2025-11-05 21:28:32'),
(8, 'advvvvvv', 'web', '2025-11-05 21:41:19', '2025-11-05 21:41:19'),
(9, 'ddd', 'web', '2025-11-05 22:49:59', '2025-11-05 22:49:59'),
(10, 'danfer', 'web', '2025-11-05 22:59:04', '2025-11-05 22:59:04'),
(11, 'xxxxx', 'web', '2025-11-06 00:06:16', '2025-11-06 00:06:16');

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
(8, 1),
(9, 6),
(10, 6),
(11, 6),
(12, 6),
(13, 6),
(14, 6),
(15, 6),
(16, 6),
(9, 7),
(13, 7);

-- --------------------------------------------------------

--
-- Table structure for table `salon`
--

CREATE TABLE `salon` (
  `idSalon` int NOT NULL,
  `tipo` enum('laboratorio','normal') NOT NULL,
  `capacidad` int NOT NULL,
  `disponibilidad` enum('habilitado','deshabilitado') NOT NULL,
  `equipamiento` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `salon`
--

INSERT INTO `salon` (`idSalon`, `tipo`, `capacidad`, `disponibilidad`, `equipamiento`) VALUES
(1, 'normal', 45, 'habilitado', '[\"Pizarra\", \"Proyector\", \"Pizarra Digital\", \"Aire acondicionado\"]'),
(2, 'normal', 43, 'habilitado', '[\"Pizarra\", \"Computadoras\"]'),
(3, 'normal', 50, 'habilitado', '[\"Proyector\", \"Aire acondicionado\", \"Pizarra\"]'),
(4, 'normal', 40, 'habilitado', '[\"Pizarra\", \"Proyector\", \"Aire acondicionado\"]'),
(5, 'normal', 40, 'habilitado', '[\"Pizarra\", \"Proyector\", \"Aire acondicionado\", \"Pizarra Digital\"]'),
(6, 'laboratorio', 30, 'habilitado', '[\"Pizarra\", \"Computadoras\", \"Audio\", \"Aire acondicionado\", \"Proyector\", \"Pizarra Digital\"]'),
(7, 'laboratorio', 30, 'habilitado', '[\"Proyector\", \"Pizarra Digital\", \"Aire acondicionado\", \"Pizarra\", \"Computadoras\", \"Audio\"]'),
(75, 'normal', 50, 'habilitado', NULL);

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
(5, 'Danfer', '21131B0737@unap.edu.pe', '$2y$12$GDQ.dXMkHC1a.GLCWQ/rTODOYO3kknAly5AD7Sms/zclAFM6RCA0i', NULL, '2025-10-08 22:22:56', '2025-10-08 22:22:56'),
(9, 'Luis Pita', 'lhpa@unap.edu.pe', '$2y$12$X1NCxNhOyj.6YD/Sz.K28.MVf3mvzi01DIDRDkuQuzayu/X8hnxsu', NULL, '2025-11-03 23:16:35', '2025-11-04 02:04:27'),
(10, 'Juan Verme', 'jmvi@unap.edu.pe', '$2y$12$HdSNhb0YLp2uCnBRst8Y6OJhAWpaIudJ3xzZX6cVNULLHsoakN0Cy', NULL, '2025-11-04 02:05:31', '2025-11-04 02:05:31'),
(11, 'Angel Catashunga', 'aict@unap.edu.pe', '$2y$12$8l.TfyHLELeWFQwO3XpMseeV26SKr6igkQ69WyyngjkLQFl12FLo6', NULL, '2025-11-04 02:06:07', '2025-11-04 02:06:07'),
(12, 'Manuel Tuesta', 'mtm@unap.edu.pe', '$2y$12$HwuqXktcdOKE8aNvWxA7NO.80PAncBA1dh1mfXgnFhTh5.qNkJgh.', NULL, '2025-11-04 02:06:27', '2025-11-04 02:06:27'),
(13, 'Carlos Gonzales', 'cga@unap.edu.pe', '$2y$12$Q3kXM6GqjBVGXtCpbuRmbuxHIHUEVIf7cuYM/5wQOdl1/nEsDtZvK', NULL, '2025-11-04 02:06:50', '2025-11-04 02:06:50'),
(14, 'Saul Nunta', 'sfn@unap.edu.pe', '$2y$12$6IMW4Si0dTMQtepR2QXXw.d05d1IR2kbgTT4oQCb93tVUhZL1ruo.', NULL, '2025-11-04 02:07:21', '2025-11-04 02:07:21'),
(15, 'Ángel Lopez', 'aelr@unap.edu.pe', '$2y$12$jHgiCONYwn/9CnM5laIqauRH6DgHOTiyknHZ9mHwWCa/4gwq1gDYK', NULL, '2025-11-04 02:07:44', '2025-11-04 02:07:44'),
(16, 'José García', 'jegd@unap.edu.pe', '$2y$12$cY6O8PcvcSYM15JEgxhS/OY0aXr8dca9d6jeRpAdAytAG71bvU7v2', NULL, '2025-11-04 02:08:00', '2025-11-04 02:08:00'),
(17, 'Rafael Vilca', 'rvb@unap.edu.pe', '$2y$12$JYlDQHlIXoUrzj.4F/wboeJpXaCT/QamGEthw9bUUmKTXIXPzxPVW', NULL, '2025-11-04 02:08:17', '2025-11-04 02:08:17'),
(18, 'Richard Lopez', 'rla@unap.edu.pe', '$2y$12$Mx2WVrKY/JmRoAxSK1AK8.kRYIOuHLtZzcLPleDukm95XQUQLxmGa', NULL, '2025-11-04 02:08:38', '2025-11-04 02:08:38'),
(19, 'Jimmy Ramirez', 'jmrv@unap.edu.pe', '$2y$12$OjlD2Fhied5pCVOt2tpVwOqCnIGs/oJwso6sgFPipAm3sV3BtRbnK', NULL, '2025-11-04 02:08:52', '2025-11-04 02:08:52'),
(20, 'Tony Bardales', 'tebl@unap.edu.pe', '$2y$12$aW4X/yIpVmsTijpgcV2v7.T7HajFoTdK7lWb7saubnkM9mCEl.xyq', NULL, '2025-11-04 02:09:12', '2025-11-04 02:09:12'),
(21, 'Francisco Ruiz', 'fmrh@unap.edu.pe', '$2y$12$j2Yo/sBq0HxG2vIpiY5ZZuV.hHq7coxfmPFAXVy1IdjI2/m2x3YLK', NULL, '2025-11-04 02:09:32', '2025-11-04 02:09:32'),
(22, 'Ángel Marthans', 'amr@unap.edu.pe', '$2y$12$c582HDTbC3.YaMaNfT7RAuWumR6LxNTnYvcHD0CNrrvI7DFoZqHQq', NULL, '2025-11-04 02:10:11', '2025-11-04 02:10:11'),
(23, 'Paul Escobar', 'pec@unap.edu.pe', '$2y$12$1elwU7gp62NIuiI3qABgSO1wVDku0Ma7Cr4IFgA5hPIJjtzqUay0e', NULL, '2025-11-04 02:10:31', '2025-11-04 02:10:31'),
(24, 'Ronald Melchor', 'rpmi@unap.edu.pe', '$2y$12$XcSMojqflatJrQ3YGkabBerPX53nAGyjvH6eA02kFVMqQDEgS2zg.', NULL, '2025-11-04 02:10:51', '2025-11-04 02:10:51'),
(25, 'PedroPrueba123123', 'pedro@unap.edu.pe', '$2y$12$agLPLqtATrGKJB7ze9rxe.kn3QrSYhturWbnKptie6FYz5D41sbPO', NULL, '2025-11-04 02:42:42', '2025-11-04 02:47:45'),
(68, 'U', 'u@t.com', '$2y$04$PcCPumzMB.v8gUZfybQ/oOY/glIlO4hginMl9AE.whKiZEQM5Uw3C', NULL, '2025-11-25 21:54:28', '2025-11-25 21:54:28');

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
  MODIFY `idCurso` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `cursoprofesorfijo`
--
ALTER TABLE `cursoprofesorfijo`
  MODIFY `idCursoProfesorFijo` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_horario_curso`
--
ALTER TABLE `detalle_horario_curso`
  MODIFY `idDetalle_Horario_Curso` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2113;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horario`
--
ALTER TABLE `horario`
  MODIFY `idHorario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `horario_curso`
--
ALTER TABLE `horario_curso`
  MODIFY `idHorarioCurso` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1196;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `profesor`
--
ALTER TABLE `profesor`
  MODIFY `idProfesor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `salon`
--
ALTER TABLE `salon`
  MODIFY `idSalon` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

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
