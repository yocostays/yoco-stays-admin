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
  useTable,
} from '@components/table';
import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { deleteUniversityAsync, getUniversityListAsync } from '@redux/services/universityServices';
import { useDispatch, useSelector } from 'react-redux';
import UniversityTableRow from '../components/UniveristyTableRow';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 'sno', label: 'S.NO.', align: 'left' },
  { id: 'university', label: 'University', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'googleMapLink', label: 'Google Map Link', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: 'evChargingStation', label: 'Ev-Charging Station', align: 'left' },
  { id: 'parkingSpaces', label: 'Parking Spaces', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

const UniversityList = () => {
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  // const [search, setSearch] = useState('')

  const { isLoading, getUniversityList, totalCount } = useSelector((store) => store?.university);

  const isNotFound = !isLoading && !getUniversityList.length && !!query;

  // const handleSearch = () => {
  //   setQuery({
  //     ...DEFAULT_QUERY,
  //     search,
  //   });
  // };

  const handleDeleteRow = async (row, closeModal) => {
    const payload = { status: !row?.status };
    const response = await dispatch(deleteUniversityAsync({ id: row?._id, data: payload }))

    console.log('response', response);

    const statusCode = response?.payload?.statusCode;

    // ✅ Show success toast if statusCode === 200
    if (statusCode === 200) {
      enqueueSnackbar(response?.payload?.message, { variant: 'success' });
    } else {
      enqueueSnackbar(response?.payload?.message || 'Something went wrong', { variant: 'error' });
    }

    if (getUniversityList?.length === 1 && query?.page > 1) {
      setQuery((p) => {
        p.page -= 1;
        return { ...p };
      });
    } else {
      dispatch(getUniversityListAsync(query));
    }
    closeModal();
    enqueueSnackbar(response?.payload?.message, { variant: 'error' });
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

  // const handleResetFilter = () => {                                            // Required Later
  //   setSearch('');
  //   setQuery({ ...DEFAULT_QUERY });
  // };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.university.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.university.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  useEffect(() => {
    dispatch(getUniversityListAsync(query));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> University: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="University List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'University', href: PATH_DASHBOARD.university.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.university.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New University
            </Button>
          }
        />

        <Card>
          {/* <UniversityTableToolbar                                               // Required Later
          filterName={search}
          onFilterName={setSearch}
          onSearch={handleSearch}
          onResetFilter={handleResetFilter}
        /> */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={getUniversityList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading ||
                    getUniversityList?.map((row, index) => (
                      <UniversityTableRow
                        index={index}
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
                    emptyRows={
                      getUniversityList?.length ? query.limit - getUniversityList.length : 0
                    }
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
};

export default UniversityList;
