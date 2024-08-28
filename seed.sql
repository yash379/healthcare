INSERT INTO public.users(
	 email, phone_number, first_name, last_name, is_active, password, role)
	VALUES ( 'admin@gmail.com', '1234567890', 'admin', 'admin', true, '$2b$10$vr9LTN7XZjBCVrKobZZtiOg1UdNnqhGB0Qde1KqEAWMU7AN7gAulG', 'ADMIN');

INSERT INTO public.super_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.hospital_roles (name)
VALUES ('ADMIN'),('DOCTOR'),('PATIENT');

INSERT INTO public.users_super_roles(
	 user_id, super_role_id)
	VALUES ( 1, 1);

INSERT INTO public.hospitals(name, city, postal_code, country_code, state_code, email, is_active, code, "addressLine1", "addressLine2", "phoneNumber")
VALUES ( 'I2IT','Pune', '344212', 'MH', 'IN', 'i2it@gmail.com',true, '111', 'Hinjewadi', 'Pune', '3432343231');

INSERT INTO public.users_hospital_roles(
	 user_id, hospital_role_id, hospital_id, is_primary)
	VALUES ( 1, 1, 1, true);

