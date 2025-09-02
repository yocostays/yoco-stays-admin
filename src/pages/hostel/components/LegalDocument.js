import React, { useCallback, useEffect } from 'react';
import { Box, Card, Grid, Typography, Stack, Button, Container } from '@mui/material';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { RHFUpload } from '@components/hook-form';
import { PATH_DASHBOARD } from '@routes/paths'; // Update based on your project structure
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { dispatch } from '@redux/store';
import { getLegalDocumentsAsync, uploadLegalDocumentsAsync } from '@redux/services';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

LegalDocument.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
};

export default function LegalDocument({ isEdit, isView }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSubmitDocument, getLegalDocuments } = useSelector((store) => store?.hostel);
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    codeOfConduct: Yup.object().nullable().required('Code of Conduct is required.'),
    refundPolicy: Yup.object().nullable().required('Refund Policy is required.'),
    roomAllocationRules: Yup.object().nullable().required('Room Allocation Rules are required.'),
  });

  // Initialize react-hook-form
  const methods = useForm({
    defaultValues: {
      codeOfConduct: null,
      refundPolicy: null,
      roomAllocationRules: null,
    },
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
  });

  const {
    setValue,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const handleDropPdf = useCallback(
    (acceptedFiles, name) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]; // Only handle the first file (PDF)
        const reader = new FileReader();
        const url = URL.createObjectURL(file);

        reader.onloadend = () => {
          const base64File = reader.result;
          setValue(
            name,
            {
              preview: url,
              url: base64File,
              file,
            },
            { shouldValidate: true }
          );
        };

        reader.readAsDataURL(file);
      }
    },
    [setValue]
  );

  const handleRemovePdf = (name) => {
    setValue(name, null, { shouldValidate: true });
  };

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  const handleSubmit = (data) => {
    const payload = {
      hostelId: id,
      legalDocuments: {
        conductPdf: data.codeOfConduct?.url || '',
        refundPolicy: data.refundPolicy?.url || '',
        allocationRule: data.roomAllocationRules?.url || '',
      },
    };

    dispatch(uploadLegalDocumentsAsync(payload)).then((response) => {
      if (response?.payload?.statusCode === 200) {
        reset();
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.addhostel.list);
      }
    });
  };

  useEffect(() => {
    const payload = {
      hostelId: id,
    };
    dispatch(getLegalDocumentsAsync(payload));
  }, [id]);

  useEffect(() => {
    if (getLegalDocuments) {
      // Check if the legal documents exist and set the values in the form
      setValue('codeOfConduct', {
        preview: getLegalDocuments?.legalDocuments?.conductPdf,
        url: getLegalDocuments?.legalDocuments?.conductPdf,
      });

      setValue('refundPolicy', {
        preview: getLegalDocuments?.legalDocuments?.refundPolicy,
        url: getLegalDocuments?.legalDocuments?.refundPolicy,
      });
      setValue('roomAllocationRules', {
        preview: getLegalDocuments?.legalDocuments?.allocationRule,
        url: getLegalDocuments?.legalDocuments?.allocationRule,
      });
    }
  }, [getLegalDocuments, setValue]);

  return (
    <>
      <Helmet>
        <title>Legal Documents | Yoco</title>
      </Helmet>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Legal Documents"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Hostel', href: PATH_DASHBOARD.addhostel.list },
            { name: 'Legal Documents' },
          ]}
        />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <Card sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Legal Documents
                  </Typography>
                  <Box
                    display="grid"
                    rowGap={4}
                    columnGap={3}
                    gridTemplateColumns={{
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >
                    {/* Code of Conduct Upload */}
                    <Stack spacing={2}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Upload Code of Conduct (PDF only)
                      </Typography>
                      <RHFUpload
                        thumbnail
                        name="codeOfConduct"
                        onDrop={(files) => handleDropPdf(files, 'codeOfConduct')}
                        onRemove={() => handleRemovePdf('codeOfConduct')}
                        accept={{ 'application/pdf': [] }}
                        disabled={isView}
                      />
                      {watch('codeOfConduct')?.file?.name && (
                        <Typography variant="body2">
                          File: {watch('codeOfConduct')?.file?.name}
                        </Typography>
                      )}
                    </Stack>

                    {/* Refund Policy Upload */}
                    <Stack spacing={2}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Upload Refund Policy (PDF only)
                      </Typography>
                      <RHFUpload
                        thumbnail
                        name="refundPolicy"
                        onDrop={(files) => handleDropPdf(files, 'refundPolicy')}
                        onRemove={() => handleRemovePdf('refundPolicy')}
                        accept={{ 'application/pdf': [] }}
                        disabled={isView}
                      />
                      {watch('refundPolicy')?.file?.name && (
                        <Typography variant="body2">
                          File: {watch('refundPolicy')?.file?.name}
                        </Typography>
                      )}
                    </Stack>

                    {/* Room Allocation Rules Upload */}
                    <Stack spacing={2}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Upload Room Allocation Rules (PDF only)
                      </Typography>
                      <RHFUpload
                        thumbnail
                        name="roomAllocationRules"
                        onDrop={(files) => handleDropPdf(files, 'roomAllocationRules')}
                        onRemove={() => handleRemovePdf('roomAllocationRules')}
                        accept={{ 'application/pdf': [] }}
                        disabled={isView}
                      />
                      {watch('roomAllocationRules')?.file?.name && (
                        <Typography variant="body2">
                          File: {watch('roomAllocationRules')?.file?.name}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                    <LoadingButton
                      loading={isSubmitDocument}
                      variant="outlined"
                      color="inherit"
                      onClick={handleBack}
                      disabled={isView}
                    >
                      Back
                    </LoadingButton>
                    <Button type="submit" variant="contained" color="primary" disabled={isView}>
                      Submit
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Container>
    </>
  );
}
