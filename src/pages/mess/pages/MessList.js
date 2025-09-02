import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Iconify from '@components/iconify';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '@components/table';

import { useDispatch, useSelector } from 'react-redux';
import { getHostelListAsync, getMessAsync } from '@redux/services';
import FormProvider from '@components/hook-form';
import { useForm } from 'react-hook-form';
import { Upload } from '@components/upload';
import { MessTableRow, MessTableToolbar } from '../components';

const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 's.no', label: 'S.No', align: 'left' },
  { id: 'hostelName', label: 'Hostel Name', align: 'left' },
  { id: 'breakFast', label: 'Break Fast', align: 'left' },
  { id: 'lunch', label: 'Lunch', align: 'left' },
  { id: 'dinner', label: 'Dinner', align: 'left' },
  { id: 'Day', label: 'Day', align: 'left' },
  { id: 'Date', label: 'Date', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), hostelId: '' }; // Add hostelId to the query object

export default function MessListPage() {
  const {
    dense,
    selected,
    onSelectRow,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const { isLoading, messList, totalCount } = useSelector((store) => store?.mess);
  const { hostelList } = useSelector((store) => store?.hostel);
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  // Create options from hostel list
  const hostelOptions = hostelList?.map((item) => ({
    label: item?.name,
    value: item?._id,
  })) || [];

  const methods = useForm({
    defaultValues: {
      files: [],
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
  };

  const isNotFound = !isLoading && !messList.length && !!query;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    setQuery({
      ...DEFAULT_QUERY,
      search,
    });
  };

  const handleHostelChange = (event, newValue) => {
    // Update the query with the selected hostel _id
    setQuery((prev) => ({
      ...prev,
      hostelId: newValue?.value || '', // Set hostelId to selected value or empty if none selected
    }));
  };

  const handleDeleteRow = async (row, closeModal) => {
    if (messList?.length === 1 && query?.page > 1) {
      setQuery((p) => {
        p.page -= 1;
        return { ...p };
      });
    } else {
      dispatch(getMessAsync(query));
    }
    closeModal();
  };

  const handleRowsPerPageChange = (event) => {
    const { value } = event.target;
    DEFAULT_QUERY.limit = parseInt(value, 10);
    onChangeRowsPerPage(event);
    setQuery((p) => {
      p.page = 1;
      p.limit = parseInt(value, 10);
      return { ...p };
    });
  };

  const handleResetFilter = () => {
    setSearch('');
    setQuery({ ...DEFAULT_QUERY, hostelId: '' }); // Reset hostelId on filter reset
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.mess.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.mess.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  useEffect(() => {
    // Fetch mess list based on the updated query
    dispatch(getMessAsync(query));
    dispatch(getHostelListAsync({}));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Mess: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mess List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Mess', href: PATH_DASHBOARD.mess.list },
            { name: 'List' },
          ]}
          action={
            <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.mess.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Add Mess
              </Button>
              <Button
                component={RouterLink}
                onClick={handleClickOpen}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Bulk Upload
              </Button>
            </Stack>
          }
        />

        <Card>
          <MessTableToolbar
            filterName={search}
            onFilterName={setSearch}
            onSearch={handleSearch}
            onResetFilter={handleResetFilter}
          />

          {/* Add Autocomplete for Hostel selection */}
          <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
            <Autocomplete
              disablePortal
              options={hostelOptions}
              getOptionLabel={(option) => option.label}
              onChange={handleHostelChange} // Update hostelId on selection change
              renderInput={(params) => <TextField {...params} size="small" label="Select Hostel" />}
              sx={{ width: 300 }}
            />
          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                />

                <TableBody>
                  {isLoading || messList?.map((row, index) => (
                    <MessTableRow
                      key={row.id}
                      index = {index}
                      query = {query}
                      row={row}
                      selected={selected.includes(row?._id)}
                      onSelectRow={() => onSelectRow(row?._id)}
                      onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row)}
                    />
                  ))}

                  <TableEmptyRows emptyRows={messList?.length ? query.limit - messList.length : 0} />

                  <TableNoData isNotFound={isNotFound} isLoading={isLoading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount}
            page={query.page - 1}
            rowsPerPage={query?.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      {/* Dialog for Bulk Upload */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Bulk Upload</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent dividers>
              <Upload
                accept=".xls/*, .csv/*" // Specify the accepted file types
                multiple={false}
                helperText="Only .xls and .csv files are allowed."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" autoFocus>
                Upload
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
