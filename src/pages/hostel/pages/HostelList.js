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
  useTable,
} from '@components/table';

import { getHostelListAsync, deleteHostelAsync } from '@redux/services/hostelList';
import { useDispatch, useSelector } from 'react-redux';
import HostelTableToolbar from '../components/HostelTableToolbar';
import HostelTableRow from '../components/HostelTableRow';

const TABLE_HEAD = [
  { id: 'action', label: 'Actions', align: 'left' },
  { id: 'sno', label: 'S No.', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'identifier', label: 'Identifier', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdby', label: 'Created By', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function HostelPage() {
  const { dense, selected, onSelectRow, onSelectAllRows, onChangeDense, onChangeRowsPerPage } =
    useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, hostelList, totalCount } = useSelector((store) => store?.hostel);

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [search, setSearch] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  // const [isFiltered, setIsFiltered] = useState(false);
  // const isNotFound = (!hostelList.length && !!query?.name) || (!hostelList.length && !!query?.role);
  const isNotFound = !isLoading && !hostelList.length && !!query;

  const handleSearch = () => {
    if (search.trim() === '') {
      // If the search field is empty, do nothing
      return;
    }

    // If there's something in the search field, update the query and fetch the data
    setQuery({
      ...DEFAULT_QUERY,
      search,
    });
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    const { value } = event.target;
    localStorage.setItem('table-rows-per-page', value); // Save to localStorage
    setQuery((p) => {
      p.page = 1;
      p.limit = parseInt(value, 10);
      return { ...p };
    });
    onChangeRowsPerPage(event);
  };

  const handleResetFilter = () => {
    setSearch('');
    setQuery({ ...DEFAULT_QUERY });
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.addhostel.edit(row?._id), { state: row });
  };

  const diningAndMessFacilityRow = (row) => {
    navigate(PATH_DASHBOARD.addhostel.diningmess(row?._id), { state: row });
  };

  const handleRoomMapRow = (row) => {
    navigate(PATH_DASHBOARD.addhostel.roommap(row?._id), { state: row });
  };

  const handleLegalDocument = (row) => {
    navigate(PATH_DASHBOARD.addhostel.legalDocument(row?._id), { state: row });
  };

  const handleDeleteRow = async (row, closeModal) => {
    const payload = { status: !row?.status };
    const response = await dispatch(deleteHostelAsync({ id: row?._id, data: payload }));
    // If API is success then only call below code.
    if (hostelList?.length === 1 && query?.page > 1) {
      setQuery((p) => {
        p.page -= 1;
        return { ...p };
      });
    } else {
      dispatch(getHostelListAsync(query));
    }
    closeModal();
    enqueueSnackbar(response?.payload?.message);
  };

  useEffect(() => {
    dispatch(getHostelListAsync(query));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title>Hostel: List | Yoco</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Hostel List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Hostel', href: PATH_DASHBOARD.addhostel.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.addhostel.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Hostel
            </Button>
          }
        />

        <Card>
          <HostelTableToolbar
            filterName={search}
            onFilterName={setSearch}
            onSearch={handleSearch}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={hostelList?.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  hostelList?.map((row) => row?._id)
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
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {isLoading ||
                    hostelList?.map((row, index) => (
                      <HostelTableRow
                        key={row._id}
                        row={row}
                        query={query}
                        index={index}
                        selected={selected.includes(row?._id)}
                        onSelectRow={() => onSelectRow(row?._id)}
                        onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                        onEditRow={() => handleEditRow(row)}
                        onDiningAndMessRow={() => diningAndMessFacilityRow(row)}
                        onRoomMap={() => handleRoomMapRow(row)}
                        legalDocument={() => handleLegalDocument(row)}
                        // isLegalDocument={row.isLegalDocument}
                      />
                    ))}

                  <TableEmptyRows
                    emptyRows={hostelList?.length ? query.limit - hostelList.length : 0}
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete?"
      />
    </>
  );
}
