import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Box,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';

export default function CommonTable({
    data = [],
    extraColumns = [],
    rowSelection: rowSelectionProp,
    setRowSelection: setRowSelectionProp,
    onSelectionChange,
    pageIndex = 1,
    pageSize = 10,
    setPagination,
    totalCount = 0,
    loading = false,
    children,
}) {
    /* -------------------- Row selection fallback -------------------- */
    const [internalRowSelection, setInternalRowSelection] = useState({});
    const rowSelection = rowSelectionProp ?? internalRowSelection;
    const setRowSelection = setRowSelectionProp ?? setInternalRowSelection;

    /* -------------------- Sticky children height -------------------- */
    const childrenRef = useRef(null);
    const childrenHeight = childrenRef.current?.offsetHeight ?? 0;

    /* -------------------- Columns -------------------- */
    const columns = useMemo(() => {
        const defaultColumns = [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                ),
            },
        ];

        return [...defaultColumns, ...extraColumns];
    }, [extraColumns]);

    /* -------------------- Table instance -------------------- */
    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
            pagination: {
                pageIndex: pageIndex - 1,
                pageSize,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pageSize),
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
    });

    /* -------------------- Notify parent selection -------------------- */
    useEffect(() => {
        if (!onSelectionChange) return;

        const selectedRows = table
            .getSelectedRowModel()
            .rows.map(r => r.original);

        onSelectionChange(selectedRows);
    }, [rowSelection, onSelectionChange, table]);

    /* ================================================================ */
    /* ============================ UI ================================ */
    /* ================================================================ */

    return (
        <Paper
            sx={{
                height: 'calc(100vh - 170px)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #7B61FF',
                borderRadius: 1,
                overflow: 'hidden', // 🔥 needed for radius
            }}
        >
            {/* ==================== SCROLL AREA ==================== */}
            <TableContainer
                sx={{
                    flex: 1,
                    overflow: 'auto',
                }}
            >
                {/* ---------- Sticky children ---------- */}
                {children && (
                    <Box
                        ref={childrenRef}
                        sx={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 30,
                            backgroundColor: '#fff',
                            paddingY: 1.5,
                            borderBottom: '1px solid #000',
                        }}
                    >
                        {children}
                    </Box>
                )}

                {/* ---------------- Table ---------------- */}
                <Table
                    sx={{
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                    }}
                >
                    <TableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableCell
                                        key={header.id}
                                        sx={{
                                            position: 'sticky',
                                            top: children ? childrenHeight : 0,
                                            zIndex: 20,
                                            backgroundColor: '#fff',
                                            fontWeight: 600,
                                            fontSize: 14,
                                            paddingY: 0.75,
                                            borderBottom: '2px solid #7B61FF',
                                            '&:first-of-type': {
                                                borderTopLeftRadius: 16,
                                            },
                                            '&:last-of-type': {
                                                borderTopRightRadius: 16,
                                            },
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>

                    <TableBody>
                        {!loading && data.length===0 && (
                            <TableRow>
                                <TableCell colSpan={100} sx={{ p: 0 }}>
                                    <Box
                                        sx={{
                                            minHeight: 220,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        No Data Found
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                        {/* ---------- Loader ---------- */}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={100} sx={{ p: 0 }}>
                                    <Box
                                        sx={{
                                            minHeight: 220,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* ---------- Rows ---------- */}
                        {!loading &&
                            table.getRowModel().rows.map((row, rowIndex) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell, cellIndex) => (
                                        <TableCell
                                            key={cell.id}
                                            sx={{
                                                paddingY: 0.5,
                                                borderBottom: '1px solid #E0E0E0',
                                                ...(rowIndex === table.getRowModel().rows.length - 1 && {
                                                    '&:first-of-type': {
                                                        borderBottomLeftRadius: 16,
                                                    },
                                                    '&:last-of-type': {
                                                        borderBottomRightRadius: 16,
                                                    },
                                                }),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ==================== PAGINATION (ATTACHED) ==================== */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderTop: '1px solid #7B61FF',
                }}
            >
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={table.getState().pagination.pageIndex}
                    rowsPerPage={table.getState().pagination.pageSize}
                    onPageChange={(_, page) =>
                        setPagination(prev => ({
                            ...prev,
                            page: page + 1,
                        }))
                    }
                    onRowsPerPageChange={e => {
                        const size = Number(e.target.value);
                        table.setPageSize(size);
                        table.setPageIndex(0);
                        setPagination(prev => ({
                            ...prev,
                            page: 1,
                            limit: size,
                        }));
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{
                        '& .MuiTablePagination-toolbar': {
                            minHeight: 36,
                            paddingY: 0,
                        },
                    }}
                />
            </Box>
        </Paper>
    );
}

/* ==================== PROPS ==================== */

CommonTable.propTypes = {
    data: PropTypes.array,
    extraColumns: PropTypes.array,
    rowSelection: PropTypes.object,
    setRowSelection: PropTypes.func,
    onSelectionChange: PropTypes.func,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    setPagination: PropTypes.func,
    totalCount: PropTypes.number,
    loading: PropTypes.bool,
    children: PropTypes.node,
};
