/* eslint-disable arrow-body-style */
import CustomBreadcrumbs from '@components/custom-breadcrumbs'
import { Box, Button, TextField, Typography, CircularProgress, IconButton } from '@mui/material'
import { createCategoryAsync, deleteTemplateCategoryAsync, getTemplateCategoryAsync } from '@redux/services/templateServices'

import { PATH_DASHBOARD } from '@routes/paths'
import react, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import toast from 'react-hot-toast'
import Breadcrumbs from '@components/BreadCumbs/BreadCumbs'

export default function CreateCategory() {
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const schema = Yup.object().shape({
        categories: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Category name is required")
            })
        )
    });

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "categories"
    });
    const { getTemplateCategory } = useSelector((state) => state?.template)
    const dispatch = useDispatch()



    useEffect(() => {
        setLoading(true)
        dispatch(getTemplateCategoryAsync()).then(() => {
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        }).finally(() => {
            setLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        /* eslint-disable array-callback-return */
        if (getTemplateCategory?.length > 0) {
            remove();
            getTemplateCategory.map((item) => {
                append({
                    name: item?.title || "",
                    isActive: item?.isDeleted,
                    ...item
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTemplateCategory]);

    const handleEdit = () => {
        setEdit(true)
    }

    const handleDelete = (index, id) => {
        setLoading(true)
        if (id) {
            dispatch(deleteTemplateCategoryAsync(id)).then(() => {
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)
            })
        }
        remove(index)
        setLoading(false)
    }

    const onSubmit = async (values) => {
        setLoading(true)
        const formatted = values?.categories?.map((item) => {
            return {
                title: item?.name,
                ...(item?._id && { _id: item._id })   // <-- add only if exists
            };
        });
        dispatch(createCategoryAsync(formatted)).then((resp) => {
            if (resp?.payload?.statusCode === 200) {
                toast.success(resp?.payload?.message)
                setLoading(false)
                setEdit(false)
                dispatch(getTemplateCategoryAsync())
            }
        }).catch((err) => {
            setLoading(false)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
         
            <Breadcrumbs
                back
                heading="Create Category"
            />
            <Box sx={{ border: "1px solid #31a3fb", maxHeight: "70vh", overflow: "auto", borderRadius: "10px", paddingX: 4 }}>
                {loading ?
                    <Box
                        sx={{
                            height: "70vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <CircularProgress size={30} />
                    </Box>
                    :
                    (
                        <>

                            <Box sx={{ display: "flex", paddingTop: 2, position: "sticky", top: "0", background: "white", zIndex: "10", justifyContent: "space-between" }}>
                                <Typography sx={{ marginY: "2px", fontSize: "14px" }}>Total Categories : <span>{getTemplateCategory?.length}</span></Typography>
                                <Button sx={{ background: "#674D9F", color: "white" }}
                                    // eslint-disable-next-line no-unused-expressions
                                    onClick={() => {
                                        // eslint-disable-next-line no-unused-expressions
                                        edit ? append({
                                            title: "",
                                            isActive: false
                                        }) : handleEdit()
                                    }}
                                >{edit ? "+" : "Edit"}</Button>
                            </Box>
                            <Box sx={{ marginY: 3 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: "16px", marginY: 2 }}>
                                    Category
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        flexDirection: "column",
                                        gap: 2,
                                        marginY: 3
                                    }}
                                >
                                    {fields.length > 0 ? fields.map((data, index) => {
                                        return (
                                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>

                                                <TextField
                                                    disabled={!edit}
                                                    key={index}
                                                    {...register(`categories.${index}.name`)}
                                                    value={watch(`categories.${index}.name`)}
                                                    sx={{
                                                        width: "23%",
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: '#000',     // border color
                                                                borderWidth: '1.5px',    // border thickness
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#1976d2',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#1976d2',
                                                            },
                                                        },
                                                    }}
                                                    variant="outlined" size="small"
                                                    onChange={(e) => {
                                                        setValue(`categories.${index}.name`, e?.target?.value);
                                                    }}
                                                />
                                                {
                                                    edit && (
                                                        <IconButton
                                                            disabled={data?.isActive}       // <-- TRUE = disabled
                                                            onClick={() => handleDelete(index, data?._id)}
                                                            sx={{
                                                                color: data?.isActive ? "gray" : "red",
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    )
                                                }

                                                <Box>
                                                    {errors?.categories?.[index]?.name && (
                                                        <Box sx={{ color: "red", fontSize: "14px" }}>{errors.categories[index].name.message}</Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        )
                                    }) : <Box sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignContent: "center" }}>No Category Found</Box>}

                                </Box>

                            </Box>
                            <Box sx={{
                                zIndex: "10", background: "white",
                                paddingY: 2,
                                display: "flex", position: "sticky", bottom: "0",
                                justifyContent: "space-between"
                            }}>
                                <Box />
                                <Button onClick={handleSubmit(onSubmit)}
                                    disabled={!edit || fields.length === 0}
                                    sx={{
                                        background: "#674D9F",
                                        color: "white",
                                        "&.Mui-disabled": {
                                            backgroundColor: "#f0f0f0",   // light grey background
                                            color: "#9e9e9e",             // grey text
                                            border: "1px solid #d3d3d3"   // optional: grey border
                                        },
                                    }}
                                >Done</Button>
                            </Box>
                        </>
                    )}
            </Box>
        </>
    )
}

