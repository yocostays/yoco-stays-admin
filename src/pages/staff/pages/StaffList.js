import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Iconify from '@components/iconify';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import { useSnackbar } from '@components/snackbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable
} from '@components/table';

import { useDispatch, useSelector } from 'react-redux';

import { getStaffAsync, deleteStaffAsync } from '@redux/services/staff';
import { StaffTableRow, StaffTableToolbar } from '../components';
// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 's.no', label: 'S.No', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'userName', label: 'User ID', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), status: 'all' };

export default function StaffListPage() {
  const {
    dense,
    order,
    orderBy,
    //
    selected,
    onSelectRow,
    //
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { isLoading, staffList, totalCount } = useSelector((store) => store?.staff);
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [search, setSearch] = useState('')


  const isNotFound = !isLoading && !staffList.length && !!query;

  const handleSearch = () => {
    if (search.length > 1) {
      setQuery({
        ...DEFAULT_QUERY,
        search,
      });
    }
  };

  const handleDeleteRow = async (row, closeModal) => {
    // API call to delete row.
    const response = await dispatch(deleteStaffAsync(row?._id))
    if (response?.payload?.statusCode === 200) {
      dispatch(getStaffAsync(query));
    }
    closeModal();
    enqueueSnackbar((response?.payload?.message), { variant: 'error' })
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
    setQuery({ ...DEFAULT_QUERY });
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.staff.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.staff.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleReload = () => {
    dispatch(getStaffAsync(query));
  }

  useEffect(() => {
    dispatch(getStaffAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Staff: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Staff List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.staff.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Staff
            </Button>
          }
        />

        <Card>
          <StaffTableToolbar
            filterName={search}
            onFilterName={setSearch}
            onSearch={handleSearch}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={staffList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading || staffList?.map((row, index) => (
                    <StaffTableRow
                      key={row.id}
                      index={index}
                      query={query}
                      row={row}
                      selected={selected.includes(row?._id)}
                      onSelectRow={() => onSelectRow(row?._id)}
                      onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row)}
                      onReload={() => handleReload()}
                    />
                  ))}

                  <TableEmptyRows
                    emptyRows={staffList?.length ? query.limit - staffList.length : 0}
                  />

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
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
