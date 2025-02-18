import { Formik } from "formik";
import ImageDropZone from "src/components/utilComponents/ImageDropZone";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme, } from "@mui/material";


const UserForm = ({
    fields,
    handleFormSubmit,
    validationSchema,
    errorMessage,
    submitButtonText,
    isSubmitLoading,
}) => {
    const { palette } = useTheme();

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const initialValues = fields.reduce((accumulator, field) => {
        accumulator[field.name] = field.initial;
        return accumulator;
    }, {});

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        {fields.map((field, i) => {
                            if (field.name !== 'picture') {
                                return (
                                    <TextField
                                        key={i}
                                        label={field.label}
                                        type={field.name === 'password' ? 'password' : null}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values[field.name]}
                                        name={field.name}
                                        error={Boolean(touched[field.name]) && Boolean(errors[field.name])}
                                        helperText={touched[field.name] && errors[field.name]}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                );
                            }
                            else {
                                return (
                                    <ImageDropZone key={i} image={values.picture} setImage={(value) => setFieldValue('picture', value)} />
                                )
                            }
                        })}
                    </Box>

                    {/* Display error message */}
                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        disabled={isSubmitLoading ? true : false}
                        type="submit"
                        sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette.primary.main,
                            color: palette.background.alt,
                            "&:hover": { backgroundColor: palette.primary.dark },
                        }}
                    >
                        {isSubmitLoading ? 'Loading...' : submitButtonText}
                    </Button>
                </form>
            )}
        </Formik>
    )
}

export default UserForm
