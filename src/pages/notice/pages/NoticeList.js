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
  useTable,
} from '@components/table';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNoticeAsync } from '@redux/services/notice';
import NoticeTablerow from '../components/NoticeTableRow';
// ----------------------------------------------------------------------

const ROLE_OPTIONS = ['all'];

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 's', label: 'S No.', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phone', label: 'Phone No', align: 'left' },
  { id: 'hostel', label: 'Hostel', align: 'left' },
  { id: 'template', label: 'Template', align: 'left' },
  // { id: 'Created By', label: 'Created By', align: 'left' },
];

const limit = 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function PushnoticeListList() {
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

  const dispatch = useDispatch();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [isFiltered, setIsFiltered] = useState(false);

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const [searchData, setSearchData] = useState('');

  const { isLoading, totalCount, noticeList } = useSelector((store) => store?.notice);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setIsFiltered(true);
    setSearchData(event?.target.value);
  };

  const handleResetFilter = () => {
    setQuery({ ...DEFAULT_QUERY });
    setIsFiltered(false);
    setSearchData('');
  };

  const handleClickSearch = () => {
    setQuery((p) => ({
      ...p,
      page: 1,
      search: searchData,
    }));
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

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.notice.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.notice.view(row?._id), { state: row });
  };

  const isNotFound =
    (!isLoading && !noticeList.length && !!query?.search) || (!isLoading && !noticeList.length && !!query?.role);

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    setSelected([]);
    dispatch(getAllNoticeAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Notice : List | MKC </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Notice List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.main }, { name: 'Notice List' }]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.notice.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
           New Notice
            </Button>
          }
        />

        <Card>
          {/* <noticeListTableToolbar
            isFiltered={isFiltered}
            filterName={searchData ?? ''}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            onFilterSearch={handleClickSearch}
          /> */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={noticeList?.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  noticeList?.map((row) => row?.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={noticeList?.length}
                  numSelected={selected.length}
                  onSort={onSort}
             
                />
                <TableBody>
                  {isLoading ? [] : noticeList?.map((row, index) => (
                    <NoticeTablerow
                      key={row.id}
                      row={row}
                      index={index}
                      query={query}
                      selected={selected.includes(row?.id)}
                      onSelectRow={() => onSelectRow(row?.id)}
                      // onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}                // Required Later
                      onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row)}
                    />
                  ))}

                  <TableEmptyRows
                    emptyRows={noticeList?.length ? query.limit - noticeList.length : 0}
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
