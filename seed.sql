INSERT INTO public.appointment_statuses(
	 code, name)
	VALUES ( '1', 'PENDING');
INSERT INTO public.appointment_statuses(
	 code, name)
	VALUES ( '2', 'INPROGRESS');
INSERT INTO public.appointment_statuses(
	 code, name)
	VALUES ( '3', 'CANCELLED');
INSERT INTO public.appointment_statuses(
	 code, name)
	VALUES ( '4', 'CONFIRMED');
	
INSERT INTO public.users(
	 email, phone_number, first_name, last_name, is_active, password, roles)
	VALUES ( 'admin@gmail.com', '1234567890', 'admin', 'admin', true, '$2b$10$vr9LTN7XZjBCVrKobZZtiOg1UdNnqhGB0Qde1KqEAWMU7AN7gAulG', 'ADMIN');

INSERT INTO public.super_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.hospital_roles (name)
VALUES ('ADMIN'),('DOCTOR'),('PATIENT');

INSERT INTO public.users_super_roles(
	 user_id, super_role_id)
	VALUES ( 1, 1);

INSERT INTO public.hospitals(name, code, email, address_1, address_2, city, postal_code, country_code, state_code, phone_number, is_active)
VALUES ( 'I2IT','1', 'i2it@gmail.com', 'Hinjewadi', 'Pune', 'Pune',  '411019', 'IN','MH', '3432343231',true   );

INSERT INTO public.users_hospital_roles(
	 user_id, hospital_role_id, hospital_id, is_primary)
	VALUES ( 1, 1, 1, true);

