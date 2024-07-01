import * as yup from "yup";


export const registerSchema = yup.object().shape({
	name: yup.string().min(2).max(50).required("required").trim(),
	email: yup.string().max(150).email("invalid email").required("required").trim(),
	password: yup.string().min(4).max(16).required("required").trim(),
	location: yup.string().min(2).max(30).required("required").trim(),
	occupation: yup.string().min(2).max(30).required("required").trim(),
});

export const loginSchema = yup.object().shape({
	email: yup.string().max(150).email("invalid email").required("required").trim(),
	password: yup.string().min(4).max(16).required("required").trim(),
});

export const editSchema = yup.object().shape({
	name: yup.string().min(2).max(50).required("required").trim(),
	email: yup.string().max(150).email("invalid email").required("required").trim(),
	password: yup.string().min(4).max(16).trim(),
	location: yup.string().min(2).max(30).required("required").trim(),
	occupation: yup.string().min(2).max(30).required("required").trim(),
});
