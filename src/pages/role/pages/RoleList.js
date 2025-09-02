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

import { getRoleAsync, deleteRoleAsync } from '@redux/services/role';
import { RoleTableRow, RoleTableToolbar } from '../components';
// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'categoryType', label: 'Category', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function UserListPage() {
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

  const { isLoading, roleList, totalCount } = useSelector((store) => store?.role);
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [search, setSearch] = useState('')


  const isNotFound = !isLoading && !roleList.length && !!query;

  const handleSearch = () => {
    setQuery({
      ...DEFAULT_QUERY,
      search,
    });
  };

  const handleDeleteRow = async (row, closeModal) => {
    // API call to delete row.
    const response = await dispatch(deleteRoleAsync(row?._id))
    // If API is success then only call below code.
    if (roleList?.length === 1 && query?.page > 1) {
      setQuery((p) => {
        p.page -= 1;
        return { ...p };
      });
    } else {
      dispatch(getRoleAsync(query));
    }
    closeModal();
    enqueueSnackbar((response?.payload?.message), {variant: 'error'})
  };

  const handleRowsPerPageChange = (event) => {
    const {value} = event.target;
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

  const handleRolePermission = (row) => {
    navigate(PATH_DASHBOARD.role.permission(row?._id), { state: row });
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.role.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.role.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  useEffect(() => {
    dispatch(getRoleAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Role: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Role List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Role', href: PATH_DASHBOARD.role.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.role.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Role
            </Button>
          }
        />

        <Card>
          <RoleTableToolbar
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
                  rowCount={roleList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading || roleList?.map((row) => (
                    <RoleTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row?.id)}
                      onSelectRow={() => onSelectRow(row?.id)}
                      onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row)}
                      onRolePermission={() => handleRolePermission(row)}
                    />
                  ))}

                  <TableEmptyRows
                    emptyRows={roleList?.length ? query.limit - roleList.length : 0}
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
