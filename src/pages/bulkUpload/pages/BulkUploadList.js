import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable
} from '@components/table';

import { useDispatch, useSelector } from 'react-redux';

import { getBulkFiles } from '@redux/services';
import { BulkUploadTableRow, BulkUploadTableToolbar } from '../components';
// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'sno', label: 'S.No.', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'orignal', label: 'Orignal file', align: 'left' },
  { id: 'success', label: 'Success file', align: 'left' },
  { id: 'error', label: 'Error file', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function BulkUploadListPage() {
  const {
    dense,
    order,
    orderBy,
    //
    selected,
    //
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { isLoading, bukFileList, totalCount } = useSelector((store) => store?.bulkUpload);
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [fileType, setFileType] = useState('')


  const isNotFound = !isLoading && !bukFileList.length && !!query;

  const handleSearch = () => {
    setQuery({
      ...DEFAULT_QUERY,
      fileType: fileType?.value,
    });
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
    setFileType('');
    setQuery({ ...DEFAULT_QUERY });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage + 1 }));
  };

  useEffect(() => {
    dispatch(getBulkFiles(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Bulk Upload: List | YOCO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Bulk Upload"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Bulk Upload List' },
          ]}
        />

        <Card>
          <BulkUploadTableToolbar
            filterName={fileType}
            onFilterName={setFileType}
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
                  rowCount={bukFileList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading || bukFileList?.map((row, index) => (
                    <BulkUploadTableRow
                      key={row.id}
                      row={row}
                      query={query}
                      index={index}
                    />
                  ))}

                  <TableEmptyRows
                    emptyRows={bukFileList?.length ? query.limit - bukFileList.length : 0}
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
