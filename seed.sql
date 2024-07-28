INSERT INTO public.users(
	 email, phone_number, first_name, last_name, password)
	VALUES ( 'admin@gmail.com', '1234567890', 'admin', 'admin', '$2b$10$vr9LTN7XZjBCVrKobZZtiOg1UdNnqhGB0Qde1KqEAWMU7AN7gAulG');

INSERT INTO public.super_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.organization_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.hospital_roles(
	 name)
	VALUES ( 'ADMIN','DOCTOR','PATIENT');

INSERT INTO public.users_super_roles(
	 user_id, super_role_id)
	VALUES ( 1, 1);

INSERT INTO public.users_hospital_roles(
	 user_id, hospital_role_id, hospital_id)
	VALUES ( 1, 1, 1);

INSERT INTO public.hospitals(
name, code, email, phone_number, address_line_1, address_line_2, city, postal_code, country_code, state_code, is_active)
VALUES ( 'I2IT', '111', 'i2it@gmail.com', '3432343231', 'Hinjewadi', 'Pune', 'Pune', '344212', 'IN', 'MH', true);