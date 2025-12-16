import { templateType } from '@components/all-enums/templateEnums';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '@components/hook-form';
import RHFEditor from '@components/hook-form/RHFEditor';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CircularProgress, Grid, Stack, Typography, Button, TextField, IconButton } from '@mui/material';
import { getHostelListAsync } from '@redux/services';
import { addTemplateAsync, creatTemplateSubCategoryAsync, deleteTemplateSubCategory, getTemplateCategoryAsync, updateTemplateAsync } from '@redux/services/templateServices';
import { PATH_DASHBOARD } from '@routes/paths';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import Button from 'src/theme/overrides/Button';
import { useForm, useFieldArray } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
// import { IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Select from 'react-select';
import LoadingScreen from '@components/loading-screen';
import toast from 'react-hot-toast';

TemplateForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentTemplate: PropTypes.object,
  loading: PropTypes.bool,
};

// Validation Schema
const templateSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  hostel: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string().required('Hostel is required'),
    })
    .nullable()
    .required('Hostel is required'),
  templateType: Yup.string().required('Template type is required'),
});

export default function TemplateForm({ isEdit = false, isView = false, currentTemplate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getTemplateCategory } = useSelector((state) => state?.template)
  const { hostelList } = useSelector((store) => store?.hostel);
  const { isSubmitting } = useSelector((store) => store?.template);
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const [edit, setEdit] = useState(false)
  const [categoryLength, setCategoryLength] = useState(0)
  const [selectedOption, setSelectedOption] = useState([]);
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];



  const hostelOptions = hostelList?.map((item) => ({
    label: item?.name,
    value: item?._id,
  }));

  const schema = Yup.object().shape({
    categories: Yup.array().of(
      Yup.object().shape({
        name: Yup.object().required("Category name is required.").typeError('Category name is required.'),
        templateType: Yup.string().required('Template Type is required.'),
        message: Yup.string().required('Message is required.')
      })
    )
  });


  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    // defaultValues: {
    //   categories: [{ name: "" }]
    // },
    resolver: yupResolver(schema)
  });



  // Fetch roles and reset form when currentTemplate or view/edit modes change
  useEffect(() => {
    dispatch(getHostelListAsync({}));
  }, [dispatch]);



  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories"
  });






  const onSubmit = (values) => {
    delete values.isActive

    const formatted = Object.values(
      values?.categories.reduce((acc, item) => {
        const categoryId = item?.name?.value;   // categoryId from name.value

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            subcategories: []
          };
        }

        acc[categoryId].subcategories.push({
          title: item.templateType,
          description: item.message,
          _id: item?._id
        });

        return acc;
      }, {})
    );
    setLoading(true)
    dispatch(creatTemplateSubCategoryAsync(formatted)).then((resp) => {
      if (resp?.payload?.statusCode === 200) {
        toast.success(resp?.payload?.message)
        setLoading(false)
        setEdit(false)
        dispatch(getTemplateCategoryAsync())
      }

    }).catch(() => {
      setLoading(false)
    }).finally(() => {
      setLoading(false)
    })
  }

  const getTemplate = async () => {
    setLoading(true)
    dispatch(getTemplateCategoryAsync()).then(() => {
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    getTemplate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleEdit = () => {
    setEdit(true)
  }
  const templateCategorySet = async () => {
    if (getTemplateCategory?.length > 0) {

      // eslint-disable-next-line arrow-body-style
      const data = getTemplateCategory.map((item) => {
        return {
          value: item?._id,
          label: item?.title
        }
      })
      setSelectedOption(data)
      const reversed = getTemplateCategory.flatMap(group =>
        group.subcategories.map(sub => ({
          name: { value: group?._id, label: group?.title },
          templateType: sub.title,
          isActive: sub?.canDelete,
          message: sub.description,
          ...(sub._id ? { _id: sub._id } : {})  // keep subcategory _id if exists
        }))
      );
      setCategoryLength(reversed?.length)
      /* eslint-disable array-callback-return */
      if (reversed?.length > 0) {
        remove();
        reversed.map((item) => {
          append({
            name: item?.name,
            isActive: item?.isActive,
            ...item
          });
        })
      }
    }

  }

  const handleDeleteRow = (index, data) => {
    setLoading(true)
    if (data._id) {
      const payload = {
        categoryId: data?.name?.value,
        subcategoryId: data?._id
      }
      dispatch(deleteTemplateSubCategory(payload)).then(() => {
        setLoading(false)
        getTemplate()
        templateCategorySet()
      }).catch(() => {
        setLoading(false)
      }).finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
      remove(index)
    }
  }


  useEffect(() => {
    templateCategorySet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTemplateCategory])

  return (
    <>
      <Box sx={{ border: "1px solid #31a3fb", height: "70vh", maxHeight: "70vh", overflow: "auto", borderRadius: "10px", paddingX: 4 }}>
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
              <Box sx={{ display: "flex", paddingY: 2, position: "sticky", top: "0", background: "white", zIndex: "10", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "14px" }}>Total Templates : <span>{categoryLength}</span></Typography>
                <Button
                  sx={{
                    background: "#674D9F",
                    color: "white",
                    "&.Mui-disabled": {
                      backgroundColor: "#f0f0f0",   // light grey background
                      color: "#9e9e9e",             // grey text
                      border: "1px solid #d3d3d3"   // optional: grey border
                    },
                  }}
                  disabled={loading}
                  // eslint-disable-next-line no-unused-expressions
                  onClick={() => {
                    // eslint-disable-next-line no-unused-expressions
                    edit ? append({
                      title: "",
                      isActive: true
                    }) : handleEdit()
                  }}
                >{edit ? "+" : "Edit"}</Button>
              </Box>
              <Box sx={{ marginY: 5, display: "flex", gap: 5 }}>

                {/* LEFT SIDE */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "16px", marginY: 2 }}>
                    Category
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      marginY: 2,
                      width: "100%",
                    }}
                  >
                    {fields.length > 0 &&
                      fields.map((data, index) => (
                        <>
                          <Box
                            key={data.id || index} // key is important!
                            sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}
                          >
                            <Select
                              isDisabled={!edit}
                              {...register(`categories.${index}.name`)}
                              value={watch(`categories.${index}.name`)}
                              onChange={(e) => {
                                setValue(`categories.${index}.name`, e, { shouldValidate: true })
                              }}
                              defaultValue={data.selectedOption || null} // use per-row value
                              options={selectedOption}
                              isClearable
                              styles={{
                                container: (base) => ({
                                  ...base,
                                  width: "100%",
                                }),
                                control: (base) => ({
                                  ...base,
                                  minHeight: 40,
                                }),
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 999999, // 🔥 very high z-index
                                }),
                                menu: (base) => ({
                                  ...base,
                                  zIndex: 999999,
                                }),
                              }}
                            />

                          </Box>
                          <Box>
                            {errors?.categories?.[index]?.name && (
                              <Box sx={{ color: "red", fontSize: "14px" }}>
                                {errors.categories[index]?.name?.message}
                              </Box>
                            )}
                          </Box>
                        </>

                      ))}
                  </Box>

                </Box>

                {/* RIGHT SIDE */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "16px", marginY: 2 }}>
                    Template Type
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      marginY: 2,
                      width: "100%",
                    }}
                  >
                    {fields.length > 0 &&
                      fields.map((data, index) => (
                        <>
                          <Box
                            key={data.id || index}
                            sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}
                          >
                            <TextField
                              disabled={!edit}
                              {...register(`categories.${index}.templateType`)}
                              value={watch(`categories.${index}.templateType`)}
                              onChange={(e) => {
                                setValue(`categories.${index}.templateType`, e?.target?.value, { shouldValidate: true })
                              }}
                              sx={{
                                flex: 1, // takes remaining width
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: '#000',
                                    borderWidth: '1.5px',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2',
                                  },
                                },
                              }}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                          <Box>
                            {errors?.categories?.[index]?.templateType && (
                              <Box sx={{ color: "red", fontSize: "14px" }}>
                                {errors.categories[index]?.templateType?.message}
                              </Box>
                            )}
                          </Box>
                        </>
                      ))}
                  </Box>

                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "16px", marginY: 2 }}>
                    Message
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      marginY: 2,
                      width: "100%",
                    }}
                  >
                    {fields.length > 0 &&
                      fields.map((data, index) => (
                        <>
                          <Box
                            key={data.id || index}
                            sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}
                          >
                            <TextField
                              disabled={!edit}
                              {...register(`categories.${index}.message`)}
                              value={watch(`categories.${index}.message`)}
                              sx={{
                                flex: 1, // takes remaining width
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: '#000',
                                    borderWidth: '1.5px',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2',
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setValue(`categories.${index}.message`, e?.target?.value, { shouldValidate: true })
                              }}
                              variant="outlined"
                              size="small"
                            />

                            {edit && (
                              <IconButton
                                disabled={!data?.isActive}
                                sx={{ color: data?.isActive ? "red" : "gray" }}
                                onClick={() => handleDeleteRow(index, data)}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            )}

                          </Box>
                          <Box>
                            {errors?.categories?.[index]?.message && (
                              <Box sx={{ color: "red", fontSize: "14px" }}>
                                {errors.categories[index]?.message?.message}
                              </Box>
                            )}
                          </Box>
                        </>

                      ))}
                  </Box>
                </Box>
              </Box>
              {fields.length === 0 && (
                <Box><Box sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignContent: "center" }}>No Category Found</Box></Box>

              )}

              <Box sx={{
                zIndex: "10", background: "white",
                paddingY: 2,
                display: "flex", position: "sticky", bottom: "0",
                justifyContent: "space-between"
              }}>
                <Box />
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!edit || loading || fields.length === 0}
                  sx={{
                    width: "126px",
                    borderRadius: "24px",
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
          )
        }


      </Box>
    </>
  );
}
