import {
    Box,
    Button,
    Card,
    Container,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    CircularProgress
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

import { useDispatch, useSelector } from 'react-redux';
import { getTemplateListAsync, getTemplateNewListAsync } from '@redux/services/templateServices';
import TemplateTableRow from '../components/TemplateTableRow';
import TemplateTableToolbar from '../components/TemplateTableToolbar';

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
    { id: 'sno', label: 'S.NO.', align: 'left' },
    { id: 'hostelCode', label: 'Hostel Code', align: 'left' },
    { id: 'hostelName', label: 'Hostel Name', align: 'left' },
    { id: 'templateCount', label: 'Total Templates', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    // { id: 'title', label: 'Title', align: 'left' },
    // { id: 'templateType', label: 'Template Type', align: 'left' },
    // { id: 'createdBy', label: 'Created By', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function TemplateNewList() {
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
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const { isLoading, getTemplateList, getNewTemplateList, totalCount, getNewTemplateListPagination } = useSelector((store) => store?.template);
    const dispatch = useDispatch();

    const [query, setQuery] = useState(DEFAULT_QUERY);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [isFiltered, setIsFiltered] = useState(false);

    const denseHeight = dense ? 52 : 72;
    const isNotFound =
        (!getTemplateList.length && !!query?.name) || (!getTemplateList.length && !!query?.role);

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
        // If API is success then only call below code.
        if (getNewTemplateList?.length === 1 && query?.page > 1) {
            setQuery((p) => {
                p.page -= 1;
                return { ...p };
            });
        } else {
            dispatch(getTemplateListAsync(query));
        }
        closeModal();
        enqueueSnackbar('Delete success!');
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
        navigate(PATH_DASHBOARD.template.viewTemplate(row?.hostelId), { state: row });
    };

    const handleViewRow = (row) => {
        navigate(PATH_DASHBOARD.template.view(row?._id), { state: row });
    };

    const handlePageChange = (event, newPage) => {
        setQuery((p) => {
            p.page = newPage + 1;
            return { ...p };
        });
    };

    useEffect(() => {
        setLoading(true)
        dispatch(getTemplateListAsync(query));
        dispatch(getTemplateNewListAsync(query)).then(() => {
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        }).finally(() => {
            setLoading(false)
        })

    }, [dispatch, query]);


  useEffect(() => {
    setQuery(prev => ({
        ...prev,
        page: 1
    }));
}, []);



    return (
        <>
            <Helmet>
                <title> Template: List | YOCO </title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Template List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Template', href: PATH_DASHBOARD.template.newlist },
                        { name: 'List' },
                    ]}
                    action={
                        <Box sx={{ display: "flex" }}>
                            <Box sx={{ marginX: "10px" }}>
                                <Button
                                    component={RouterLink}
                                    to={PATH_DASHBOARD.template.category}
                                    variant="contained"
                                    endIcon={<Iconify icon="eva:plus-fill" />}
                                >
                                    Create Category
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    component={RouterLink}
                                    to={PATH_DASHBOARD.template.new}
                                    variant="contained"
                                    endIcon={<Iconify icon="eva:plus-fill" />}
                                >
                                    Create Template
                                </Button>
                            </Box>
                        </Box>
                    }
                />

                <Card>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={getNewTemplateList?.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    getNewTemplateList?.map((row) => row?.id)
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
                                    headLabel={TABLE_HEAD}
                                />

                                <TableBody>
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {loading ? (
                                        <TableRow sx={{ height: 200 }}>
                                            <TableCell colSpan={8} align="center">
                                                <CircularProgress size={28} />
                                            </TableCell>
                                        </TableRow>
                                    ) : getNewTemplateList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        getNewTemplateList.map((row, index) => (
                                            <TemplateTableRow
                                                key={row.id}
                                                index={index}
                                                row={row}
                                                selected={selected.includes(row?.id)}
                                                onSelectRow={() => onSelectRow(row?.id)}
                                                onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                                                onEditRow={() => handleEditRow(row)}
                                                onViewRow={() => handleViewRow(row)}
                                            />
                                        ))
                                    )}

                                    {!loading && (
                                        <>
                                            <TableEmptyRows
                                                emptyRows={
                                                    getNewTemplateList?.length
                                                        ? query.limit - getNewTemplateList.length
                                                        : 0
                                                }
                                            />
                                            <TableNoData isNotFound={isNotFound} />
                                        </>
                                    )}
                                </TableBody>

                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={getNewTemplateListPagination?.totalHostels}
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
    )
}