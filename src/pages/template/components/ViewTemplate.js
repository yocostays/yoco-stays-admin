
import { yupResolver } from '@hookform/resolvers/yup';
import { Box,CircularProgress, Typography, Button, TextField } from '@mui/material';
import { getHostelListAsync } from '@redux/services';
import { addHostelTemplateCategoryAsync, getHostelTemplateCategoryAsync, getTemplateCategoryAsync, updateTemplateAsync } from '@redux/services/templateServices';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import Select from 'react-select';




export default function ViewTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  const { getTemplateCategory, gateHostelCategory } = useSelector((state) => state?.template)
  const [categoryLength, setCategoryLength] = useState(0)
  const [selectedOption, setSelectedOption] = useState([]);

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
    defaultValues: {
      categories: [{ name: "" }]
    },
    resolver: yupResolver(schema)
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories"
  });


  useEffect(() => {
    setLoading(true)
    dispatch(getTemplateCategoryAsync())
    dispatch(getHostelTemplateCategoryAsync(id)).then(() => {
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    }).finally(() => {
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  useEffect(() => {

    if (getTemplateCategory?.length > 0) {
      // eslint-disable-next-line arrow-body-style
      const data = getTemplateCategory.map((item) => {
        return {
          value: item?._id,
          label: item?.title
        }
      })
      setSelectedOption(data)
      const reversed = gateHostelCategory.flatMap(group =>
        group.subcategories.map(sub => ({
          name: { value: group?.categoryId, label: group?.categoryTitle },
          templateType: sub.title,
          isActive: sub?.applied,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTemplateCategory, gateHostelCategory])


  const onSubmit = async (data) => {
    setLoading(true)
    const payload = {
      hostelId: id,
      globalTemplateId: data?.name?.value,
      subcategoryId: data?._id
    }
    dispatch(addHostelTemplateCategoryAsync(payload)).then((resp) => {
      console.log(resp,"resppppppppp")
      setLoading(false)
      dispatch(getHostelTemplateCategoryAsync(id))
    }).catch(() => {
      setLoading(false)
    }).finally(() => {
      setLoading(false)
    })
  }



  return (
    <>
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

              <Box sx={{ paddingY: 2, position: "sticky", top: "0", background: "white", zIndex: "10", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "14px" }}><span>{location?.state?.hostelCode}</span></Typography>
                <Typography sx={{ fontSize: "14px" }}>Total Templates : <span>{categoryLength}</span></Typography>
                <Box />
              </Box>
              <Box sx={{ marginY: 2, display: "flex", gap: 5 }}>

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
                              isDisabled
                              {...register(`categories.${index}.name`)}
                              value={watch(`categories.${index}.name`)}
                              onChange={(e) => {
                                setValue(`categories.${index}.name`, e, { shouldValidate: true })
                              }}
                              defaultValue={data.selectedOption || null} // use per-row value
                              // onChange={(option) => handleSelectChange(option, index)} // update per row
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
                              disabled
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
                            key={data?.id || index}
                            sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}
                          >
                            <TextField
                              disabled
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

                            {/* formateddd */}
                            {!data?.isActive ? <Box sx={{ width: 40 }}>
                              <Button sx={{ background: "#674D9F", color: "white" }}
                                // eslint-disable-next-line no-unused-expressions
                                onClick={() => {
                                  // eslint-disable-next-line no-unused-expressions
                                  onSubmit(data)
                                }}
                              >+</Button>
                            </Box> : <Box sx={{ width: 40 }} />}
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
            </>
          )}
      </Box>
    </>
  );
}
