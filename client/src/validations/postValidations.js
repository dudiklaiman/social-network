import * as yup from "yup";


export const createPostSchema = yup.object().shape({
	description: yup.string().max(1400).trim(),
	
});
