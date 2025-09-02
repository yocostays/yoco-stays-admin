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
import { deleteCourseAsync, getCourseAsync } from '@redux/services';
import CourseTableRow from '../components/CourseTableRow';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 'sno', label: 'S.No.', align: 'left' },
  { id: 'Course', label: 'Course', align: 'left' },
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
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [query, setQuery] = useState(DEFAULT_QUERY);

  // const [search, setSearch] = useState('');   // Required Later

  const { isLoading, courseList, totalCount } = useSelector((store) => store?.course);

  const isNotFound = !isLoading && !courseList.length && !!query;

  const handleDeleteRow = async (row, closeModal) => {
    const response = await dispatch(deleteCourseAsync(row?._id));
    if (response?.payload?.statusCode === 200) {
      dispatch(getCourseAsync(query));
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

  // const handleResetFilter = () => {                         // Required Later
  //   setSearch('');
  //   setQuery({ ...DEFAULT_QUERY });
  // };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.course.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.course.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  useEffect(() => {
    dispatch(getCourseAsync(query));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Course: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Course List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Course', href: PATH_DASHBOARD.course.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.course.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Course
            </Button>
          }
        />

        <Card>
          {/* <CourseTableToolbar                                                        // Required Later
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
                    courseList?.map((row , index) => (
                      <CourseTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        selected={selected.includes(row?.id)}
                        onSelectRow={() => onSelectRow(row?.id)}
                        onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                        // onCoursePermission={() => handleCoursePermission(row)}
                      />
                    ))}

                  <TableEmptyRows
                    emptyRows={courseList?.length ? query.limit - courseList.length : 0}
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
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
