-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2025 at 03:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uji`
--

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--

CREATE TABLE `bus` (
  `kd_bus` char(5) NOT NULL,
  `status_bus` enum('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus`
--

INSERT INTO `bus` (`kd_bus`, `status_bus`) VALUES
('TR053', 'Aktif'),
('TR054', 'Aktif'),
('TR055', 'Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `halte`
--

CREATE TABLE `halte` (
  `id_halte` char(5) NOT NULL,
  `nama_halte` varchar(50) DEFAULT NULL,
  `id_rute` char(5) DEFAULT NULL,
  `urutan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `halte`
--

INSERT INTO `halte` (`id_halte`, `nama_halte`, `id_rute`, `urutan`) VALUES
('HT001', 'Shelter Masjid Jamik', 'RT001', 1),
('HT002', 'Shelter Ekonomi', 'RT001', 2),
('HT003', 'Shelter Auditorium', 'RT001', 3),
('HT004', 'Shelter Bundaran UIN', 'RT001', 4),
('HT005', 'Shelter Fakultas Dakwah', 'RT001', 5),
('HT006', 'Shelter Bank Aceh UIN', 'RT001', 6),
('HT007', 'Shelter Labschool', 'RT001', 7),
('HT008', 'Asrama USK', 'RT001', 8),
('HT009', 'Halte Portable Kopelma', 'RT001', 9),
('HT010', 'Halte Ekonomi', 'RT001', 10),
('HT011', 'Shelter Gelanggang', 'RT001', 11),
('HT012', 'Shelter MIPA', 'RT001', 12),
('HT013', 'Shelter Ilmu Sosial', 'RT001', 13),
('HT014', 'Shelter Kedokteran Hewan', 'RT001', 14);

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id_jadwal` char(5) NOT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL,
  `waktu` time NOT NULL,
  `kd_bus` char(5) NOT NULL,
  `id_rute` char(5) NOT NULL,
  `id_halte` char(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id_jadwal`, `hari`, `waktu`, `kd_bus`, `id_rute`, `id_halte`) VALUES
('JD001', 'Senin', '07:30:00', 'TR053', 'RT001', 'HT001'),
('JD002', 'Senin', '08:05:00', 'TR054', 'RT001', 'HT001'),
('JD003', 'Senin', '08:20:00', 'TR055', 'RT001', 'HT001'),
('JD004', 'Senin', '08:40:00', 'TR053', 'RT001', 'HT001'),
('JD005', 'Senin', '09:10:00', 'TR054', 'RT001', 'HT001'),
('JD006', 'Senin', '09:25:00', 'TR055', 'RT001', 'HT001'),
('JD007', 'Senin', '09:50:00', 'TR053', 'RT001', 'HT001'),
('JD008', 'Senin', '10:45:00', 'TR054', 'RT001', 'HT001'),
('JD009', 'Senin', '11:00:00', 'TR055', 'RT001', 'HT001'),
('JD010', 'Senin', '11:30:00', 'TR053', 'RT001', 'HT001'),
('JD011', 'Senin', '12:15:00', 'TR054', 'RT001', 'HT001'),
('JD012', 'Senin', '12:30:00', 'TR055', 'RT001', 'HT001'),
('JD013', 'Senin', '13:15:00', 'TR053', 'RT001', 'HT001'),
('JD014', 'Senin', '13:50:00', 'TR054', 'RT001', 'HT001'),
('JD015', 'Senin', '14:05:00', 'TR055', 'RT001', 'HT001'),
('JD016', 'Senin', '14:40:00', 'TR053', 'RT001', 'HT001'),
('JD017', 'Senin', '15:15:00', 'TR054', 'RT001', 'HT001'),
('JD018', 'Senin', '15:30:00', 'TR055', 'RT001', 'HT001'),
('JD019', 'Senin', '16:10:00', 'TR053', 'RT001', 'HT001'),
('JD020', 'Senin', '16:45:00', 'TR054', 'RT001', 'HT001'),
('JD021', 'Senin', '17:00:00', 'TR055', 'RT001', 'HT001'),
('JD022', 'Senin', '17:30:00', 'TR053', 'RT001', 'HT001'),
('JD023', 'Senin', '17:50:00', 'TR054', 'RT001', 'HT001'),
('JD024', 'Senin', '18:05:00', 'TR055', 'RT001', 'HT001'),
('JD025', 'Senin', '07:34:00', 'TR053', 'RT001', 'HT002'),
('JD026', 'Senin', '08:09:00', 'TR054', 'RT001', 'HT002'),
('JD027', 'Senin', '08:24:00', 'TR055', 'RT001', 'HT002'),
('JD028', 'Senin', '08:44:00', 'TR053', 'RT001', 'HT002'),
('JD029', 'Senin', '09:14:00', 'TR054', 'RT001', 'HT002'),
('JD030', 'Senin', '09:29:00', 'TR055', 'RT001', 'HT002'),
('JD031', 'Senin', '09:54:00', 'TR053', 'RT001', 'HT002'),
('JD032', 'Senin', '10:49:00', 'TR054', 'RT001', 'HT002'),
('JD033', 'Senin', '11:04:00', 'TR055', 'RT001', 'HT002'),
('JD034', 'Senin', '11:34:00', 'TR053', 'RT001', 'HT002'),
('JD035', 'Senin', '12:19:00', 'TR054', 'RT001', 'HT002'),
('JD036', 'Senin', '12:34:00', 'TR055', 'RT001', 'HT002'),
('JD037', 'Senin', '13:19:00', 'TR053', 'RT001', 'HT002'),
('JD038', 'Senin', '13:54:00', 'TR054', 'RT001', 'HT002'),
('JD039', 'Senin', '14:09:00', 'TR055', 'RT001', 'HT002'),
('JD040', 'Senin', '14:44:00', 'TR053', 'RT001', 'HT002'),
('JD041', 'Senin', '15:19:00', 'TR054', 'RT001', 'HT002'),
('JD042', 'Senin', '15:34:00', 'TR055', 'RT001', 'HT002'),
('JD043', 'Senin', '16:14:00', 'TR053', 'RT001', 'HT002'),
('JD044', 'Senin', '16:49:00', 'TR054', 'RT001', 'HT002'),
('JD045', 'Senin', '17:04:00', 'TR055', 'RT001', 'HT002'),
('JD046', 'Senin', '17:34:00', 'TR053', 'RT001', 'HT002'),
('JD047', 'Senin', '17:54:00', 'TR054', 'RT001', 'HT002'),
('JD048', 'Senin', '18:09:00', 'TR055', 'RT001', 'HT002'),
('JD049', 'Senin', '07:36:00', 'TR053', 'RT001', 'HT003'),
('JD050', 'Senin', '08:11:00', 'TR054', 'RT001', 'HT003'),
('JD051', 'Senin', '08:26:00', 'TR055', 'RT001', 'HT003'),
('JD052', 'Senin', '08:46:00', 'TR053', 'RT001', 'HT003'),
('JD053', 'Senin', '09:16:00', 'TR054', 'RT001', 'HT003'),
('JD054', 'Senin', '09:31:00', 'TR055', 'RT001', 'HT003'),
('JD055', 'Senin', '09:56:00', 'TR053', 'RT001', 'HT003'),
('JD056', 'Senin', '10:51:00', 'TR054', 'RT001', 'HT003'),
('JD057', 'Senin', '11:06:00', 'TR055', 'RT001', 'HT003'),
('JD058', 'Senin', '11:36:00', 'TR053', 'RT001', 'HT003'),
('JD059', 'Senin', '12:21:00', 'TR054', 'RT001', 'HT003'),
('JD060', 'Senin', '12:36:00', 'TR055', 'RT001', 'HT003'),
('JD061', 'Senin', '13:21:00', 'TR053', 'RT001', 'HT003'),
('JD062', 'Senin', '13:56:00', 'TR054', 'RT001', 'HT003'),
('JD063', 'Senin', '14:11:00', 'TR055', 'RT001', 'HT003'),
('JD064', 'Senin', '14:46:00', 'TR053', 'RT001', 'HT003'),
('JD065', 'Senin', '15:21:00', 'TR054', 'RT001', 'HT003'),
('JD066', 'Senin', '15:36:00', 'TR055', 'RT001', 'HT003'),
('JD067', 'Senin', '16:16:00', 'TR053', 'RT001', 'HT003'),
('JD068', 'Senin', '16:51:00', 'TR054', 'RT001', 'HT003'),
('JD069', 'Senin', '17:06:00', 'TR055', 'RT001', 'HT003'),
('JD070', 'Senin', '17:36:00', 'TR053', 'RT001', 'HT003'),
('JD071', 'Senin', '17:56:00', 'TR054', 'RT001', 'HT003'),
('JD072', 'Senin', '18:11:00', 'TR055', 'RT001', 'HT003'),
('JD073', 'Senin', '07:38:00', 'TR053', 'RT001', 'HT004'),
('JD074', 'Senin', '08:13:00', 'TR054', 'RT001', 'HT004'),
('JD075', 'Senin', '08:28:00', 'TR055', 'RT001', 'HT004'),
('JD076', 'Senin', '08:48:00', 'TR053', 'RT001', 'HT004'),
('JD077', 'Senin', '09:18:00', 'TR054', 'RT001', 'HT004'),
('JD078', 'Senin', '09:33:00', 'TR055', 'RT001', 'HT004'),
('JD079', 'Senin', '09:58:00', 'TR053', 'RT001', 'HT004'),
('JD080', 'Senin', '10:53:00', 'TR054', 'RT001', 'HT004'),
('JD081', 'Senin', '11:08:00', 'TR055', 'RT001', 'HT004'),
('JD082', 'Senin', '11:38:00', 'TR053', 'RT001', 'HT004'),
('JD083', 'Senin', '12:23:00', 'TR054', 'RT001', 'HT004'),
('JD084', 'Senin', '12:38:00', 'TR055', 'RT001', 'HT004'),
('JD085', 'Senin', '13:23:00', 'TR053', 'RT001', 'HT004'),
('JD086', 'Senin', '13:58:00', 'TR054', 'RT001', 'HT004'),
('JD087', 'Senin', '14:13:00', 'TR055', 'RT001', 'HT004'),
('JD088', 'Senin', '14:48:00', 'TR053', 'RT001', 'HT004'),
('JD089', 'Senin', '15:23:00', 'TR054', 'RT001', 'HT004'),
('JD090', 'Senin', '15:38:00', 'TR055', 'RT001', 'HT004'),
('JD091', 'Senin', '16:18:00', 'TR053', 'RT001', 'HT004'),
('JD092', 'Senin', '16:53:00', 'TR054', 'RT001', 'HT004'),
('JD093', 'Senin', '17:08:00', 'TR055', 'RT001', 'HT004'),
('JD094', 'Senin', '17:38:00', 'TR053', 'RT001', 'HT004'),
('JD095', 'Senin', '17:58:00', 'TR054', 'RT001', 'HT004'),
('JD096', 'Senin', '18:13:00', 'TR055', 'RT001', 'HT004'),
('JD097', 'Senin', '07:39:00', 'TR053', 'RT001', 'HT005'),
('JD098', 'Senin', '08:14:00', 'TR054', 'RT001', 'HT005'),
('JD099', 'Senin', '08:29:00', 'TR055', 'RT001', 'HT005'),
('JD100', 'Senin', '08:49:00', 'TR053', 'RT001', 'HT005'),
('JD101', 'Senin', '09:19:00', 'TR054', 'RT001', 'HT005'),
('JD102', 'Senin', '09:34:00', 'TR055', 'RT001', 'HT005'),
('JD103', 'Senin', '09:59:00', 'TR053', 'RT001', 'HT005'),
('JD104', 'Senin', '10:54:00', 'TR054', 'RT001', 'HT005'),
('JD105', 'Senin', '11:09:00', 'TR055', 'RT001', 'HT005'),
('JD106', 'Senin', '11:39:00', 'TR053', 'RT001', 'HT005'),
('JD107', 'Senin', '12:24:00', 'TR054', 'RT001', 'HT005'),
('JD108', 'Senin', '12:39:00', 'TR055', 'RT001', 'HT005'),
('JD109', 'Senin', '13:24:00', 'TR053', 'RT001', 'HT005'),
('JD110', 'Senin', '13:59:00', 'TR054', 'RT001', 'HT005'),
('JD111', 'Senin', '14:14:00', 'TR055', 'RT001', 'HT005'),
('JD112', 'Senin', '14:49:00', 'TR053', 'RT001', 'HT005'),
('JD113', 'Senin', '15:24:00', 'TR054', 'RT001', 'HT005'),
('JD114', 'Senin', '15:39:00', 'TR055', 'RT001', 'HT005'),
('JD115', 'Senin', '16:19:00', 'TR053', 'RT001', 'HT005'),
('JD116', 'Senin', '16:54:00', 'TR054', 'RT001', 'HT005'),
('JD117', 'Senin', '17:09:00', 'TR055', 'RT001', 'HT005'),
('JD118', 'Senin', '17:39:00', 'TR053', 'RT001', 'HT005'),
('JD119', 'Senin', '17:59:00', 'TR054', 'RT001', 'HT005'),
('JD120', 'Senin', '18:14:00', 'TR055', 'RT001', 'HT005'),
('JD121', 'Senin', '07:41:00', 'TR053', 'RT001', 'HT006'),
('JD122', 'Senin', '08:16:00', 'TR054', 'RT001', 'HT006'),
('JD123', 'Senin', '08:31:00', 'TR055', 'RT001', 'HT006'),
('JD124', 'Senin', '08:51:00', 'TR053', 'RT001', 'HT006'),
('JD125', 'Senin', '09:21:00', 'TR054', 'RT001', 'HT006'),
('JD126', 'Senin', '09:36:00', 'TR055', 'RT001', 'HT006'),
('JD127', 'Senin', '10:01:00', 'TR053', 'RT001', 'HT006'),
('JD128', 'Senin', '10:56:00', 'TR054', 'RT001', 'HT006'),
('JD129', 'Senin', '11:11:00', 'TR055', 'RT001', 'HT006'),
('JD130', 'Senin', '11:41:00', 'TR053', 'RT001', 'HT006'),
('JD131', 'Senin', '12:26:00', 'TR054', 'RT001', 'HT006'),
('JD132', 'Senin', '12:41:00', 'TR055', 'RT001', 'HT006'),
('JD133', 'Senin', '13:26:00', 'TR053', 'RT001', 'HT006'),
('JD134', 'Senin', '14:01:00', 'TR054', 'RT001', 'HT006'),
('JD135', 'Senin', '14:16:00', 'TR055', 'RT001', 'HT006'),
('JD136', 'Senin', '14:51:00', 'TR053', 'RT001', 'HT006'),
('JD137', 'Senin', '15:26:00', 'TR054', 'RT001', 'HT006'),
('JD138', 'Senin', '15:41:00', 'TR055', 'RT001', 'HT006'),
('JD139', 'Senin', '16:21:00', 'TR053', 'RT001', 'HT006'),
('JD140', 'Senin', '16:56:00', 'TR054', 'RT001', 'HT006'),
('JD141', 'Senin', '17:11:00', 'TR055', 'RT001', 'HT006'),
('JD142', 'Senin', '17:41:00', 'TR053', 'RT001', 'HT006'),
('JD143', 'Senin', '18:01:00', 'TR054', 'RT001', 'HT006'),
('JD144', 'Senin', '18:16:00', 'TR055', 'RT001', 'HT006'),
('JD145', 'Senin', '07:43:00', 'TR053', 'RT001', 'HT007'),
('JD146', 'Senin', '08:18:00', 'TR054', 'RT001', 'HT007'),
('JD147', 'Senin', '08:33:00', 'TR055', 'RT001', 'HT007'),
('JD148', 'Senin', '08:53:00', 'TR053', 'RT001', 'HT007'),
('JD149', 'Senin', '09:23:00', 'TR054', 'RT001', 'HT007'),
('JD150', 'Senin', '09:38:00', 'TR055', 'RT001', 'HT007'),
('JD151', 'Senin', '10:03:00', 'TR053', 'RT001', 'HT007'),
('JD152', 'Senin', '10:58:00', 'TR054', 'RT001', 'HT007'),
('JD153', 'Senin', '11:13:00', 'TR055', 'RT001', 'HT007'),
('JD154', 'Senin', '11:43:00', 'TR053', 'RT001', 'HT007'),
('JD155', 'Senin', '12:28:00', 'TR054', 'RT001', 'HT007'),
('JD156', 'Senin', '12:43:00', 'TR055', 'RT001', 'HT007'),
('JD157', 'Senin', '13:28:00', 'TR053', 'RT001', 'HT007'),
('JD158', 'Senin', '14:03:00', 'TR054', 'RT001', 'HT007'),
('JD159', 'Senin', '14:18:00', 'TR055', 'RT001', 'HT007'),
('JD160', 'Senin', '14:53:00', 'TR053', 'RT001', 'HT007'),
('JD161', 'Senin', '15:28:00', 'TR054', 'RT001', 'HT007'),
('JD162', 'Senin', '15:43:00', 'TR055', 'RT001', 'HT007'),
('JD163', 'Senin', '16:23:00', 'TR053', 'RT001', 'HT007'),
('JD164', 'Senin', '16:58:00', 'TR054', 'RT001', 'HT007'),
('JD165', 'Senin', '17:13:00', 'TR055', 'RT001', 'HT007'),
('JD166', 'Senin', '17:43:00', 'TR053', 'RT001', 'HT007'),
('JD167', 'Senin', '18:03:00', 'TR054', 'RT001', 'HT007'),
('JD168', 'Senin', '18:18:00', 'TR055', 'RT001', 'HT007'),
('JD169', 'Senin', '07:30:00', 'TR054', 'RT001', 'HT008'),
('JD170', 'Senin', '07:45:00', 'TR055', 'RT001', 'HT008'),
('JD171', 'Senin', '08:00:00', 'TR053', 'RT001', 'HT008'),
('JD172', 'Senin', '08:35:00', 'TR054', 'RT001', 'HT008'),
('JD173', 'Senin', '08:50:00', 'TR055', 'RT001', 'HT008'),
('JD174', 'Senin', '09:10:00', 'TR053', 'RT001', 'HT008'),
('JD175', 'Senin', '09:50:00', 'TR054', 'RT001', 'HT008'),
('JD176', 'Senin', '10:05:00', 'TR055', 'RT001', 'HT008'),
('JD177', 'Senin', '10:40:00', 'TR053', 'RT001', 'HT008'),
('JD178', 'Senin', '11:30:00', 'TR054', 'RT001', 'HT008'),
('JD179', 'Senin', '11:45:00', 'TR055', 'RT001', 'HT008'),
('JD180', 'Senin', '12:10:00', 'TR053', 'RT001', 'HT008'),
('JD181', 'Senin', '13:15:00', 'TR054', 'RT001', 'HT008'),
('JD182', 'Senin', '13:30:00', 'TR055', 'RT001', 'HT008'),
('JD183', 'Senin', '13:45:00', 'TR053', 'RT001', 'HT008'),
('JD184', 'Senin', '14:40:00', 'TR054', 'RT001', 'HT008'),
('JD185', 'Senin', '14:55:00', 'TR055', 'RT001', 'HT008'),
('JD186', 'Senin', '15:15:00', 'TR053', 'RT001', 'HT008'),
('JD187', 'Senin', '16:10:00', 'TR054', 'RT001', 'HT008'),
('JD188', 'Senin', '16:25:00', 'TR055', 'RT001', 'HT008'),
('JD189', 'Senin', '16:55:00', 'TR053', 'RT001', 'HT008'),
('JD190', 'Senin', '17:15:00', 'TR054', 'RT001', 'HT008'),
('JD191', 'Senin', '17:30:00', 'TR055', 'RT001', 'HT008'),
('JD192', 'Senin', '18:00:00', 'TR053', 'RT001', 'HT008'),
('JD193', 'Senin', '07:32:00', 'TR054', 'RT001', 'HT009'),
('JD194', 'Senin', '07:47:00', 'TR055', 'RT001', 'HT009'),
('JD195', 'Senin', '08:02:00', 'TR053', 'RT001', 'HT009'),
('JD196', 'Senin', '08:37:00', 'TR054', 'RT001', 'HT009'),
('JD197', 'Senin', '08:52:00', 'TR055', 'RT001', 'HT009'),
('JD198', 'Senin', '09:12:00', 'TR053', 'RT001', 'HT009'),
('JD199', 'Senin', '09:52:00', 'TR054', 'RT001', 'HT009'),
('JD200', 'Senin', '10:07:00', 'TR055', 'RT001', 'HT009'),
('JD201', 'Senin', '10:42:00', 'TR053', 'RT001', 'HT009'),
('JD202', 'Senin', '11:32:00', 'TR054', 'RT001', 'HT009'),
('JD203', 'Senin', '11:47:00', 'TR055', 'RT001', 'HT009'),
('JD204', 'Senin', '12:12:00', 'TR053', 'RT001', 'HT009'),
('JD205', 'Senin', '13:17:00', 'TR054', 'RT001', 'HT009'),
('JD206', 'Senin', '13:32:00', 'TR055', 'RT001', 'HT009'),
('JD207', 'Senin', '13:47:00', 'TR053', 'RT001', 'HT009'),
('JD208', 'Senin', '14:42:00', 'TR054', 'RT001', 'HT009'),
('JD209', 'Senin', '14:57:00', 'TR055', 'RT001', 'HT009'),
('JD210', 'Senin', '15:17:00', 'TR053', 'RT001', 'HT009'),
('JD211', 'Senin', '16:12:00', 'TR054', 'RT001', 'HT009'),
('JD212', 'Senin', '16:27:00', 'TR055', 'RT001', 'HT009'),
('JD213', 'Senin', '16:57:00', 'TR053', 'RT001', 'HT009'),
('JD214', 'Senin', '17:17:00', 'TR054', 'RT001', 'HT009'),
('JD215', 'Senin', '17:32:00', 'TR055', 'RT001', 'HT009'),
('JD216', 'Senin', '18:02:00', 'TR053', 'RT001', 'HT009'),
('JD217', 'Senin', '07:34:00', 'TR054', 'RT001', 'HT010'),
('JD218', 'Senin', '07:49:00', 'TR055', 'RT001', 'HT010'),
('JD219', 'Senin', '08:04:00', 'TR053', 'RT001', 'HT010'),
('JD220', 'Senin', '08:39:00', 'TR054', 'RT001', 'HT010'),
('JD221', 'Senin', '08:54:00', 'TR055', 'RT001', 'HT010'),
('JD222', 'Senin', '09:14:00', 'TR053', 'RT001', 'HT010'),
('JD223', 'Senin', '09:54:00', 'TR054', 'RT001', 'HT010'),
('JD224', 'Senin', '10:09:00', 'TR055', 'RT001', 'HT010'),
('JD225', 'Senin', '10:44:00', 'TR053', 'RT001', 'HT010'),
('JD226', 'Senin', '11:34:00', 'TR054', 'RT001', 'HT010'),
('JD227', 'Senin', '11:49:00', 'TR055', 'RT001', 'HT010'),
('JD228', 'Senin', '12:14:00', 'TR053', 'RT001', 'HT010'),
('JD229', 'Senin', '13:19:00', 'TR054', 'RT001', 'HT010'),
('JD230', 'Senin', '13:34:00', 'TR055', 'RT001', 'HT010'),
('JD231', 'Senin', '13:49:00', 'TR053', 'RT001', 'HT010'),
('JD232', 'Senin', '14:44:00', 'TR054', 'RT001', 'HT010'),
('JD233', 'Senin', '14:59:00', 'TR055', 'RT001', 'HT010'),
('JD234', 'Senin', '15:19:00', 'TR053', 'RT001', 'HT010'),
('JD235', 'Senin', '16:14:00', 'TR054', 'RT001', 'HT010'),
('JD236', 'Senin', '16:29:00', 'TR055', 'RT001', 'HT010'),
('JD237', 'Senin', '16:59:00', 'TR053', 'RT001', 'HT010'),
('JD238', 'Senin', '17:19:00', 'TR054', 'RT001', 'HT010'),
('JD239', 'Senin', '17:34:00', 'TR055', 'RT001', 'HT010'),
('JD240', 'Senin', '18:04:00', 'TR053', 'RT001', 'HT010'),
('JD241', 'Senin', '07:37:00', 'TR054', 'RT001', 'HT011'),
('JD242', 'Senin', '07:52:00', 'TR055', 'RT001', 'HT011'),
('JD243', 'Senin', '08:07:00', 'TR053', 'RT001', 'HT011'),
('JD244', 'Senin', '08:42:00', 'TR054', 'RT001', 'HT011'),
('JD245', 'Senin', '08:57:00', 'TR055', 'RT001', 'HT011'),
('JD246', 'Senin', '09:17:00', 'TR053', 'RT001', 'HT011'),
('JD247', 'Senin', '09:57:00', 'TR054', 'RT001', 'HT011'),
('JD248', 'Senin', '10:12:00', 'TR055', 'RT001', 'HT011'),
('JD249', 'Senin', '10:47:00', 'TR053', 'RT001', 'HT011'),
('JD250', 'Senin', '11:37:00', 'TR054', 'RT001', 'HT011'),
('JD251', 'Senin', '11:52:00', 'TR055', 'RT001', 'HT011'),
('JD252', 'Senin', '12:17:00', 'TR053', 'RT001', 'HT011'),
('JD253', 'Senin', '13:22:00', 'TR054', 'RT001', 'HT011'),
('JD254', 'Senin', '13:37:00', 'TR055', 'RT001', 'HT011'),
('JD255', 'Senin', '13:52:00', 'TR053', 'RT001', 'HT011'),
('JD256', 'Senin', '14:47:00', 'TR054', 'RT001', 'HT011'),
('JD257', 'Senin', '15:02:00', 'TR055', 'RT001', 'HT011'),
('JD258', 'Senin', '15:22:00', 'TR053', 'RT001', 'HT011'),
('JD259', 'Senin', '16:17:00', 'TR054', 'RT001', 'HT011'),
('JD260', 'Senin', '16:32:00', 'TR055', 'RT001', 'HT011'),
('JD261', 'Senin', '17:02:00', 'TR053', 'RT001', 'HT011'),
('JD262', 'Senin', '17:22:00', 'TR054', 'RT001', 'HT011'),
('JD263', 'Senin', '17:37:00', 'TR055', 'RT001', 'HT011'),
('JD264', 'Senin', '18:07:00', 'TR053', 'RT001', 'HT011'),
('JD265', 'Senin', '07:40:00', 'TR054', 'RT001', 'HT012'),
('JD266', 'Senin', '07:55:00', 'TR055', 'RT001', 'HT012'),
('JD267', 'Senin', '08:10:00', 'TR053', 'RT001', 'HT012'),
('JD268', 'Senin', '08:45:00', 'TR054', 'RT001', 'HT012'),
('JD269', 'Senin', '09:00:00', 'TR055', 'RT001', 'HT012'),
('JD270', 'Senin', '09:20:00', 'TR053', 'RT001', 'HT012'),
('JD271', 'Senin', '10:00:00', 'TR054', 'RT001', 'HT012'),
('JD272', 'Senin', '10:15:00', 'TR055', 'RT001', 'HT012'),
('JD273', 'Senin', '10:50:00', 'TR053', 'RT001', 'HT012'),
('JD274', 'Senin', '11:40:00', 'TR054', 'RT001', 'HT012'),
('JD275', 'Senin', '11:55:00', 'TR055', 'RT001', 'HT012'),
('JD276', 'Senin', '12:20:00', 'TR053', 'RT001', 'HT012'),
('JD277', 'Senin', '13:25:00', 'TR054', 'RT001', 'HT012'),
('JD278', 'Senin', '13:40:00', 'TR055', 'RT001', 'HT012'),
('JD279', 'Senin', '13:55:00', 'TR053', 'RT001', 'HT012'),
('JD280', 'Senin', '14:50:00', 'TR054', 'RT001', 'HT012'),
('JD281', 'Senin', '15:05:00', 'TR055', 'RT001', 'HT012'),
('JD282', 'Senin', '15:25:00', 'TR053', 'RT001', 'HT012'),
('JD283', 'Senin', '16:20:00', 'TR054', 'RT001', 'HT012'),
('JD284', 'Senin', '16:35:00', 'TR055', 'RT001', 'HT012'),
('JD285', 'Senin', '17:05:00', 'TR053', 'RT001', 'HT012'),
('JD286', 'Senin', '17:25:00', 'TR054', 'RT001', 'HT012'),
('JD287', 'Senin', '17:40:00', 'TR055', 'RT001', 'HT012'),
('JD288', 'Senin', '18:10:00', 'TR053', 'RT001', 'HT012'),
('JD289', 'Senin', '07:43:00', 'TR054', 'RT001', 'HT013'),
('JD290', 'Senin', '07:58:00', 'TR055', 'RT001', 'HT013'),
('JD291', 'Senin', '08:13:00', 'TR053', 'RT001', 'HT013'),
('JD292', 'Senin', '08:48:00', 'TR054', 'RT001', 'HT013'),
('JD293', 'Senin', '09:03:00', 'TR055', 'RT001', 'HT013'),
('JD294', 'Senin', '09:23:00', 'TR053', 'RT001', 'HT013'),
('JD295', 'Senin', '10:03:00', 'TR054', 'RT001', 'HT013'),
('JD296', 'Senin', '10:18:00', 'TR055', 'RT001', 'HT013'),
('JD297', 'Senin', '10:53:00', 'TR053', 'RT001', 'HT013'),
('JD298', 'Senin', '11:43:00', 'TR054', 'RT001', 'HT013'),
('JD299', 'Senin', '11:58:00', 'TR055', 'RT001', 'HT013'),
('JD300', 'Senin', '12:23:00', 'TR053', 'RT001', 'HT013'),
('JD301', 'Senin', '13:28:00', 'TR054', 'RT001', 'HT013'),
('JD302', 'Senin', '13:43:00', 'TR055', 'RT001', 'HT013'),
('JD303', 'Senin', '13:58:00', 'TR053', 'RT001', 'HT013'),
('JD304', 'Senin', '14:53:00', 'TR054', 'RT001', 'HT013'),
('JD305', 'Senin', '15:08:00', 'TR055', 'RT001', 'HT013'),
('JD306', 'Senin', '15:28:00', 'TR053', 'RT001', 'HT013'),
('JD307', 'Senin', '16:23:00', 'TR054', 'RT001', 'HT013'),
('JD308', 'Senin', '16:38:00', 'TR055', 'RT001', 'HT013'),
('JD309', 'Senin', '17:08:00', 'TR053', 'RT001', 'HT013'),
('JD310', 'Senin', '17:28:00', 'TR054', 'RT001', 'HT013'),
('JD311', 'Senin', '17:43:00', 'TR055', 'RT001', 'HT013'),
('JD312', 'Senin', '18:13:00', 'TR053', 'RT001', 'HT013'),
('JD313', 'Senin', '07:46:00', 'TR054', 'RT001', 'HT014'),
('JD314', 'Senin', '08:01:00', 'TR055', 'RT001', 'HT014'),
('JD315', 'Senin', '08:16:00', 'TR053', 'RT001', 'HT014'),
('JD316', 'Senin', '08:51:00', 'TR054', 'RT001', 'HT014'),
('JD317', 'Senin', '09:06:00', 'TR055', 'RT001', 'HT014'),
('JD318', 'Senin', '09:26:00', 'TR053', 'RT001', 'HT014'),
('JD319', 'Senin', '10:06:00', 'TR054', 'RT001', 'HT014'),
('JD320', 'Senin', '10:21:00', 'TR055', 'RT001', 'HT014'),
('JD321', 'Senin', '10:56:00', 'TR053', 'RT001', 'HT014'),
('JD322', 'Senin', '11:46:00', 'TR054', 'RT001', 'HT014'),
('JD323', 'Senin', '12:01:00', 'TR055', 'RT001', 'HT014'),
('JD324', 'Senin', '12:26:00', 'TR053', 'RT001', 'HT014'),
('JD325', 'Senin', '13:31:00', 'TR054', 'RT001', 'HT014'),
('JD326', 'Senin', '13:46:00', 'TR055', 'RT001', 'HT014'),
('JD327', 'Senin', '14:01:00', 'TR053', 'RT001', 'HT014'),
('JD328', 'Senin', '14:56:00', 'TR054', 'RT001', 'HT014'),
('JD329', 'Senin', '15:11:00', 'TR055', 'RT001', 'HT014'),
('JD330', 'Senin', '15:31:00', 'TR053', 'RT001', 'HT014'),
('JD331', 'Senin', '16:26:00', 'TR054', 'RT001', 'HT014'),
('JD332', 'Senin', '16:41:00', 'TR055', 'RT001', 'HT014'),
('JD333', 'Senin', '17:11:00', 'TR053', 'RT001', 'HT014'),
('JD334', 'Senin', '17:31:00', 'TR054', 'RT001', 'HT014'),
('JD335', 'Senin', '17:46:00', 'TR055', 'RT001', 'HT014'),
('JD336', 'Senin', '18:16:00', 'TR053', 'RT001', 'HT014'),
('JD337', 'Sabtu', '07:30:00', 'TR053', 'RT001', 'HT001'),
('JD338', 'Sabtu', '08:40:00', 'TR053', 'RT001', 'HT001'),
('JD339', 'Sabtu', '09:50:00', 'TR053', 'RT001', 'HT001'),
('JD340', 'Sabtu', '11:30:00', 'TR053', 'RT001', 'HT001'),
('JD341', 'Sabtu', '13:15:00', 'TR053', 'RT001', 'HT001'),
('JD342', 'Sabtu', '14:40:00', 'TR053', 'RT001', 'HT001'),
('JD343', 'Sabtu', '16:10:00', 'TR053', 'RT001', 'HT001'),
('JD344', 'Sabtu', '17:30:00', 'TR053', 'RT001', 'HT001'),
('JD345', 'Sabtu', '07:34:00', 'TR053', 'RT001', 'HT002'),
('JD346', 'Sabtu', '08:44:00', 'TR053', 'RT001', 'HT002'),
('JD347', 'Sabtu', '09:54:00', 'TR053', 'RT001', 'HT002'),
('JD348', 'Sabtu', '11:34:00', 'TR053', 'RT001', 'HT002'),
('JD349', 'Sabtu', '13:19:00', 'TR053', 'RT001', 'HT002'),
('JD350', 'Sabtu', '14:44:00', 'TR053', 'RT001', 'HT002'),
('JD351', 'Sabtu', '16:14:00', 'TR053', 'RT001', 'HT002'),
('JD352', 'Sabtu', '17:34:00', 'TR053', 'RT001', 'HT002'),
('JD353', 'Sabtu', '07:36:00', 'TR053', 'RT001', 'HT003'),
('JD354', 'Sabtu', '08:46:00', 'TR053', 'RT001', 'HT003'),
('JD355', 'Sabtu', '09:56:00', 'TR053', 'RT001', 'HT003'),
('JD356', 'Sabtu', '11:36:00', 'TR053', 'RT001', 'HT003'),
('JD357', 'Sabtu', '13:21:00', 'TR053', 'RT001', 'HT003'),
('JD358', 'Sabtu', '14:46:00', 'TR053', 'RT001', 'HT003'),
('JD359', 'Sabtu', '16:16:00', 'TR053', 'RT001', 'HT003'),
('JD360', 'Sabtu', '17:36:00', 'TR053', 'RT001', 'HT003'),
('JD361', 'Sabtu', '07:38:00', 'TR053', 'RT001', 'HT004'),
('JD362', 'Sabtu', '08:48:00', 'TR053', 'RT001', 'HT004'),
('JD363', 'Sabtu', '09:58:00', 'TR053', 'RT001', 'HT004'),
('JD364', 'Sabtu', '11:38:00', 'TR053', 'RT001', 'HT004'),
('JD365', 'Sabtu', '13:23:00', 'TR053', 'RT001', 'HT004'),
('JD366', 'Sabtu', '14:48:00', 'TR053', 'RT001', 'HT004'),
('JD367', 'Sabtu', '16:18:00', 'TR053', 'RT001', 'HT004'),
('JD368', 'Sabtu', '17:38:00', 'TR053', 'RT001', 'HT004'),
('JD369', 'Sabtu', '07:39:00', 'TR053', 'RT001', 'HT005'),
('JD370', 'Sabtu', '08:49:00', 'TR053', 'RT001', 'HT005'),
('JD371', 'Sabtu', '09:59:00', 'TR053', 'RT001', 'HT005'),
('JD372', 'Sabtu', '11:39:00', 'TR053', 'RT001', 'HT005'),
('JD373', 'Sabtu', '13:24:00', 'TR053', 'RT001', 'HT005'),
('JD374', 'Sabtu', '14:49:00', 'TR053', 'RT001', 'HT005'),
('JD375', 'Sabtu', '16:19:00', 'TR053', 'RT001', 'HT005'),
('JD376', 'Sabtu', '17:39:00', 'TR053', 'RT001', 'HT005'),
('JD377', 'Sabtu', '07:41:00', 'TR053', 'RT001', 'HT006'),
('JD378', 'Sabtu', '08:51:00', 'TR053', 'RT001', 'HT006'),
('JD379', 'Sabtu', '10:01:00', 'TR053', 'RT001', 'HT006'),
('JD380', 'Sabtu', '11:41:00', 'TR053', 'RT001', 'HT006'),
('JD381', 'Sabtu', '13:26:00', 'TR053', 'RT001', 'HT006'),
('JD382', 'Sabtu', '14:51:00', 'TR053', 'RT001', 'HT006'),
('JD383', 'Sabtu', '16:21:00', 'TR053', 'RT001', 'HT006'),
('JD384', 'Sabtu', '17:41:00', 'TR053', 'RT001', 'HT006'),
('JD385', 'Sabtu', '07:43:00', 'TR053', 'RT001', 'HT007'),
('JD386', 'Sabtu', '08:53:00', 'TR053', 'RT001', 'HT007'),
('JD387', 'Sabtu', '10:03:00', 'TR053', 'RT001', 'HT007'),
('JD388', 'Sabtu', '11:43:00', 'TR053', 'RT001', 'HT007'),
('JD389', 'Sabtu', '13:28:00', 'TR053', 'RT001', 'HT007'),
('JD390', 'Sabtu', '14:53:00', 'TR053', 'RT001', 'HT007'),
('JD391', 'Sabtu', '16:23:00', 'TR053', 'RT001', 'HT007'),
('JD392', 'Sabtu', '17:43:00', 'TR053', 'RT001', 'HT007'),
('JD393', 'Sabtu', '08:00:00', 'TR053', 'RT001', 'HT008'),
('JD394', 'Sabtu', '09:10:00', 'TR053', 'RT001', 'HT008'),
('JD395', 'Sabtu', '10:40:00', 'TR053', 'RT001', 'HT008'),
('JD396', 'Sabtu', '12:10:00', 'TR053', 'RT001', 'HT008'),
('JD397', 'Sabtu', '13:45:00', 'TR053', 'RT001', 'HT008'),
('JD398', 'Sabtu', '15:15:00', 'TR053', 'RT001', 'HT008'),
('JD399', 'Sabtu', '16:55:00', 'TR053', 'RT001', 'HT008'),
('JD400', 'Sabtu', '18:00:00', 'TR053', 'RT001', 'HT008'),
('JD401', 'Sabtu', '08:02:00', 'TR053', 'RT001', 'HT009'),
('JD402', 'Sabtu', '09:12:00', 'TR053', 'RT001', 'HT009'),
('JD403', 'Sabtu', '10:42:00', 'TR053', 'RT001', 'HT009'),
('JD404', 'Sabtu', '12:12:00', 'TR053', 'RT001', 'HT009'),
('JD405', 'Sabtu', '13:47:00', 'TR053', 'RT001', 'HT009'),
('JD406', 'Sabtu', '15:17:00', 'TR053', 'RT001', 'HT009'),
('JD407', 'Sabtu', '16:57:00', 'TR053', 'RT001', 'HT009'),
('JD408', 'Sabtu', '18:02:00', 'TR053', 'RT001', 'HT009'),
('JD409', 'Sabtu', '08:04:00', 'TR053', 'RT001', 'HT010'),
('JD410', 'Sabtu', '09:14:00', 'TR053', 'RT001', 'HT010'),
('JD411', 'Sabtu', '10:44:00', 'TR053', 'RT001', 'HT010'),
('JD412', 'Sabtu', '12:14:00', 'TR053', 'RT001', 'HT010'),
('JD413', 'Sabtu', '13:49:00', 'TR053', 'RT001', 'HT010'),
('JD414', 'Sabtu', '15:19:00', 'TR053', 'RT001', 'HT010'),
('JD415', 'Sabtu', '16:59:00', 'TR053', 'RT001', 'HT010'),
('JD416', 'Sabtu', '18:04:00', 'TR053', 'RT001', 'HT010'),
('JD417', 'Sabtu', '08:07:00', 'TR053', 'RT001', 'HT011'),
('JD418', 'Sabtu', '09:17:00', 'TR053', 'RT001', 'HT011'),
('JD419', 'Sabtu', '10:47:00', 'TR053', 'RT001', 'HT011'),
('JD420', 'Sabtu', '12:17:00', 'TR053', 'RT001', 'HT011'),
('JD421', 'Sabtu', '13:52:00', 'TR053', 'RT001', 'HT011'),
('JD422', 'Sabtu', '15:22:00', 'TR053', 'RT001', 'HT011'),
('JD423', 'Sabtu', '17:02:00', 'TR053', 'RT001', 'HT011'),
('JD424', 'Sabtu', '18:07:00', 'TR053', 'RT001', 'HT011'),
('JD425', 'Sabtu', '08:10:00', 'TR053', 'RT001', 'HT012'),
('JD426', 'Sabtu', '09:20:00', 'TR053', 'RT001', 'HT012'),
('JD427', 'Sabtu', '10:50:00', 'TR053', 'RT001', 'HT012'),
('JD428', 'Sabtu', '12:20:00', 'TR053', 'RT001', 'HT012'),
('JD429', 'Sabtu', '13:55:00', 'TR053', 'RT001', 'HT012'),
('JD430', 'Sabtu', '15:25:00', 'TR053', 'RT001', 'HT012'),
('JD431', 'Sabtu', '17:05:00', 'TR053', 'RT001', 'HT012'),
('JD432', 'Sabtu', '18:10:00', 'TR053', 'RT001', 'HT012'),
('JD433', 'Sabtu', '08:13:00', 'TR053', 'RT001', 'HT013'),
('JD434', 'Sabtu', '09:23:00', 'TR053', 'RT001', 'HT013'),
('JD435', 'Sabtu', '10:53:00', 'TR053', 'RT001', 'HT013'),
('JD436', 'Sabtu', '12:23:00', 'TR053', 'RT001', 'HT013'),
('JD437', 'Sabtu', '13:58:00', 'TR053', 'RT001', 'HT013'),
('JD438', 'Sabtu', '15:28:00', 'TR053', 'RT001', 'HT013'),
('JD439', 'Sabtu', '17:08:00', 'TR053', 'RT001', 'HT013'),
('JD440', 'Sabtu', '18:13:00', 'TR053', 'RT001', 'HT013'),
('JD441', 'Sabtu', '08:16:00', 'TR053', 'RT001', 'HT014'),
('JD442', 'Sabtu', '09:26:00', 'TR053', 'RT001', 'HT014'),
('JD443', 'Sabtu', '10:56:00', 'TR053', 'RT001', 'HT014'),
('JD444', 'Sabtu', '12:26:00', 'TR053', 'RT001', 'HT014'),
('JD445', 'Sabtu', '14:01:00', 'TR053', 'RT001', 'HT014'),
('JD446', 'Sabtu', '15:31:00', 'TR053', 'RT001', 'HT014'),
('JD447', 'Sabtu', '17:11:00', 'TR053', 'RT001', 'HT014'),
('JD448', 'Sabtu', '18:16:00', 'TR053', 'RT001', 'HT014');

-- --------------------------------------------------------

--
-- Table structure for table `jalur`
--

CREATE TABLE `jalur` (
  `id_jalur` char(5) NOT NULL,
  `id_halte_awal` char(5) DEFAULT NULL,
  `id_halte_akhir` char(5) DEFAULT NULL,
  `jarak` int(11) DEFAULT NULL,
  `waktu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jalur`
--

INSERT INTO `jalur` (`id_jalur`, `id_halte_awal`, `id_halte_akhir`, `jarak`, `waktu`) VALUES
('JL001', 'HT001', 'HT002', NULL, 4),
('JL002', 'HT002', 'HT003', NULL, 3),
('JL003', 'HT003', 'HT004', NULL, 5),
('JL004', 'HT004', 'HT005', NULL, 4),
('JL005', 'HT005', 'HT006', NULL, 3),
('JL006', 'HT006', 'HT007', NULL, 5),
('JL007', 'HT007', 'HT008', NULL, 3),
('JL008', 'HT008', 'HT009', NULL, 2),
('JL009', 'HT009', 'HT010', NULL, 3),
('JL010', 'HT010', 'HT011', NULL, 4),
('JL011', 'HT011', 'HT012', NULL, 3),
('JL012', 'HT012', 'HT013', NULL, 4),
('JL013', 'HT013', 'HT014', NULL, 5),
('JL014', 'HT014', 'HT001', NULL, 10);

-- --------------------------------------------------------

--
-- Table structure for table `rute`
--

CREATE TABLE `rute` (
  `id_rute` char(5) NOT NULL,
  `nama_rute` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rute`
--

INSERT INTO `rute` (`id_rute`, `nama_rute`) VALUES
('RT001', 'Masjid Jamik -> Asrama USK'),
('RT002', 'Asrama USK -> Masjid Jamik');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bus`
--
ALTER TABLE `bus`
  ADD PRIMARY KEY (`kd_bus`);

--
-- Indexes for table `halte`
--
ALTER TABLE `halte`
  ADD PRIMARY KEY (`id_halte`),
  ADD KEY `id_rute` (`id_rute`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id_jadwal`),
  ADD KEY `kd_bus` (`kd_bus`),
  ADD KEY `id_rute` (`id_rute`),
  ADD KEY `id_halte` (`id_halte`),
  ADD KEY `idx_jadwal_halte` (`id_halte`),
  ADD KEY `idx_jadwal_hari` (`hari`),
  ADD KEY `idx_jadwal_waktu` (`waktu`);

--
-- Indexes for table `jalur`
--
ALTER TABLE `jalur`
  ADD PRIMARY KEY (`id_jalur`),
  ADD KEY `id_halte_awal` (`id_halte_awal`),
  ADD KEY `id_halte_akhir` (`id_halte_akhir`),
  ADD KEY `idx_jalur_awal` (`id_halte_awal`),
  ADD KEY `idx_jalur_akhir` (`id_halte_akhir`);

--
-- Indexes for table `rute`
--
ALTER TABLE `rute`
  ADD PRIMARY KEY (`id_rute`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `halte`
--
ALTER TABLE `halte`
  ADD CONSTRAINT `halte_ibfk_1` FOREIGN KEY (`id_rute`) REFERENCES `rute` (`id_rute`);

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`kd_bus`) REFERENCES `bus` (`kd_bus`),
  ADD CONSTRAINT `jadwal_ibfk_2` FOREIGN KEY (`id_rute`) REFERENCES `rute` (`id_rute`),
  ADD CONSTRAINT `jadwal_ibfk_3` FOREIGN KEY (`id_halte`) REFERENCES `halte` (`id_halte`);

--
-- Constraints for table `jalur`
--
ALTER TABLE `jalur`
  ADD CONSTRAINT `jalur_ibfk_1` FOREIGN KEY (`id_halte_awal`) REFERENCES `halte` (`id_halte`),
  ADD CONSTRAINT `jalur_ibfk_2` FOREIGN KEY (`id_halte_akhir`) REFERENCES `halte` (`id_halte`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
