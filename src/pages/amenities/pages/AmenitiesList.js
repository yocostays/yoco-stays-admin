import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
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
  useTable,
} from '@components/table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAmenitiesAsync, getAmenitiesAsync } from '@redux/services/amenitiesServices';
import AmenitiesTableRow from '../components/AmenitiesTableRow';
import AmenitiesTableToolbar from '../components/AmenitiesTableToolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 'Amenities', label: 'Amenities', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function UserListPage() {
  const {
    dense,
    order,
    orderBy,
    selected,
    onSelectRow,
    //
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { isLoading, amenitiesList, count  } = useSelector((store) => store?.amenities);
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const isNotFound = !isLoading && !amenitiesList.length && !!query;

  const [search, setSearch] = useState('');

  const handleDeleteRow = async (row, closeModal) => {
    const response = await dispatch(deleteAmenitiesAsync(row?._id));
    if (response?.payload?.statusCode === 200) {
      dispatch(getAmenitiesAsync(query));
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
  const handleResetFilter = () => {
    setSearch('');
    setQuery({ ...DEFAULT_QUERY });
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.amenities.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.amenities.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  useEffect(() => {
    dispatch(getAmenitiesAsync(query));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Amenities: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Amenities List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Amenities', href: PATH_DASHBOARD.amenities.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.amenities.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Amenities
            </Button>
          }
        />

        <Card>
          {/* <AmenitiesTableToolbar 
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
                  // rowCount={courseList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading ||
                    amenitiesList?.map((row) => (
                      <AmenitiesTableRow
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
                    emptyRows={amenitiesList?.length ? query.limit - amenitiesList.length : 0}
                  />

                  <TableNoData isNotFound={isNotFound} isLoading={isLoading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={count}
            page={query.page - 1}
            rowsPerPage={query?.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
