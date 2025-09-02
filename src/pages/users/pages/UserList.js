import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import ConfirmDialog from '@components/confirm-dialog';
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
  TableSelectedAction,
  useTable
} from '@components/table';

import { deleteUserAsync, getUsersAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';

import { UserTableRow, UserTableToolbar } from '../components';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'yocoid', label: 'YOCO ID', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'roomNo', label: 'Room No.', align: 'left' },
  { id: 'phone', label: 'Phone No.', align: 'left' },
  { id: 'joiningDate', label: 'Joining Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];


const dummyRow = {
  yocoid: 'YOCO123',
  name: 'John Doe',
  roomNo: '305',
  phone: '123-456-7890',
  joiningDate: '2023-05-15',
  isVerified: true,
  status: 'active', 
};

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function UserListPage() {
  const {
    dense,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { isLoading, alert, users, totalCount } = useSelector((store) => store?.users);
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [isFiltered, setIsFiltered] = useState(false);

  const denseHeight = dense ? 52 : 72;
  // const isNotFound = (!users.length && !!query?.name) || (!users.length && !!query?.role);
  const isNotFound = true

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setIsFiltered(true);
    setQuery((p) => {
      p.page = 1;
      p.name = event?.target?.value;
      return { ...p };
    });
  };

  const handleFilterRole = (event) => {
    setIsFiltered(true);
    setQuery((p) => {
      p.page = 1;
      p.role = event?.target?.value;
      return { ...p };
    });
  };

  const handleDeleteRow = async (row, closeModal) => {
    // API call to delete row.
    const response = await dispatch(deleteUserAsync(row?.id))
    // If API is success then only call below code.
    if (users?.length === 1 && query?.page > 1) {
      setQuery((p) => {
        p.page -= 1;
        return { ...p };
      });
    } else {
      dispatch(getUsersAsync(query));
    }
    closeModal();
    enqueueSnackbar('Delete success!')
  };

  const handleDeleteRows = (selectedRows) => {
    // API call to delete row.

    // If API is success then call below code.
    setSelected([]);
    if (query?.page > 1) {
      if (selectedRows?.length === users?.length) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else if (users?.length > selectedRows?.length) {
        dispatch(getUsersAsync(query));
      }
    } else {
      dispatch(getUsersAsync(query));
    }
    handleCloseConfirm();
  };

  const handleRowsPerPageChange = (event) => {
    const value = event.target.value;
    DEFAULT_QUERY.limit = parseInt(value, 10);
    onChangeRowsPerPage(event);
    setQuery((p) => {
      p.page = 1;
      p.limit = parseInt(value, 10);
      return { ...p };
    });
  };

  const handleResetFilter = () => {
    setQuery({...DEFAULT_QUERY});
    setIsFiltered(false);
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.users.edit(row?.id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.users.view(row?.id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  // useEffect(() => {
  //   setSelected([]);
  //   dispatch(getUsersAsync(query));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> User: List | YOCO  </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.users.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.users.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          }
        />

        <Card>
          {/* <UserTableToolbar
            isFiltered={isFiltered}
            filterName={query?.name ?? ''}
            filterRole={query?.role ?? ''}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
          /> */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              // numSelected={selected.length}
              // rowCount={users?.length}
              // onSelectAllRows={(checked) =>
              //   onSelectAllRows(
              //     checked,
              //     users?.map((row) => row?.id)
              //   )
              // }
              // action={
              //   <Tooltip title="Delete">
              //     <IconButton color="primary" onClick={handleOpenConfirm}>
              //       <Iconify icon="eva:trash-2-outline" />
              //     </IconButton>
              //   </Tooltip>
              // }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  // order={order}
                  // orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={users?.length}
                  // numSelected={selected.length}
                  // onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     users?.map((row) => row?.id)
                  //   )
                  // }
                />

                <TableBody>
                  {users?.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row?.id)}
                      onSelectRow={() => onSelectRow(row?.id)}
                      onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row)}
                    />
                  ))}

                  <TableEmptyRows
                    // height={denseHeight}
                    emptyRows={users?.length ? query.limit - users.length : 0}
                  />

                  <TableNoData isNotFound={isNotFound} />
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
