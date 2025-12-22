/* eslint-disable */
import { Box, Button, Typography } from "@mui/material";
import { getTemplateNewListAsync } from "@redux/services/templateServices";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line import/no-unresolved
import SimpleTable from "src/table/table";
// import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Iconify from '@components/iconify';
// import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "@routes/paths";
import DebouncedSearch from "src/debounced/DebouncedSearch";
import CommonTable from "src/table/table";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Breadcrumbs from "@components/BreadCumbs/BreadCumbs";
import LaunchIcon from '@mui/icons-material/Launch'; // Import the icon

export default function Table() {
    const { getNewTemplateList, getNewTemplateListPagination } = useSelector((store) => store?.template);
    const dispatch = useDispatch();
    const [rowSelection, setRowSelection] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        status: "",
    });
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    const extraColumns = [
        {
            accessorKey: 'hostelCode',
            header: 'Hostel Code',
            cell: info => info.getValue() || '-'
        },
        {
            accessorKey: 'hostelName',
            header: 'Hostel Name',
            cell: info => info.getValue() || '-',

        },
        {
            accessorKey: 'subCategoryCount',
            header: 'Total Templates',
            cell: info => <Typography sx={{
                textAlign: "center",
                width: "80%"
            }}>{info.getValue()}</Typography>
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const { original } = row
                return (
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center"
                    }}  >
                        <Box>
                            <Typography variant="subtitle2" noWrap>
                                {original?.status ? "Active" : "Inactive"}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: original?.status ? "green" : "orange",
                                opacity: original?.status ? 1 : 0.4,
                            }}
                        />
                    </Box>
                )
            }
        },
        {
            accessorKey: 'action',
            header: '',
            cell: ({ row }) => {
                const { original } = row
                return (
                    <Box onClick={() => {
                        navigate(PATH_DASHBOARD.template.viewTemplate(original?.hostelId), { state: original });
                    }}>
                        <LaunchIcon sx={{ fontSize: 17,marginY:"auto", cursor: 'pointer' }} /> 
                    </Box>
                )
            }
        },
    ];




    useEffect(() => {
        setLoading(true)
        const payload = {
            ...pagination,
            search: search || ''
        }
        dispatch(getTemplateNewListAsync(payload)).then(() => {
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        }).finally(() => {
            setLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, pagination, search]);

    const Children = () => {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }} >
                {/* eslint-disable react/self-closing-comp */}
                <Box />
                <Box>
                    <DebouncedSearch
                        placeholder="Search By Hostel Name..."
                        delay={1000}
                        value={search}
                        onChange={(value) => {
                            setSearch(value || "")
                        }
                        }
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    gap: 3
                }}>
                    <Box>
                        <Button
                            onClick={() => {
                                setPagination({
                                    page: 1,
                                    limit: 10,
                                    status: ""
                                });
                            }}
                            sx={{
                                fontSize: "14px",
                                fontWeight: 200,
                                paddingY: 0.3,
                                borderRadius: 0.5,
                                border: "1px solid #000000",
                                color: pagination?.status === "" ? "white" : "#000000",
                                backgroundColor:
                                    pagination?.status === "" ? "#6B52AE" : "#fff",

                                // 👇 Prevent focus color change
                                "&:hover": {
                                    backgroundColor: "#6B52AE",
                                    color: "#ffff"
                                },

                            }}
                            variant="outlined"
                        >
                            All
                        </Button>

                    </Box>
                    <Box>
                        <Button
                            onClick={() => {
                                setPagination({
                                    page: 1,
                                    limit: 10,
                                    status: true
                                })
                            }}
                            sx={{
                                fontSize: "14px",
                                fontWeight: 200,
                                paddingY: 0.3,
                                borderRadius: 0.5,
                                border: "1px solid #000000",
                                color: pagination?.status === true ? 'white' : '#000000',
                                backgroundColor:
                                    pagination?.status === true ? "#6B52AE" : "#fff",
                                '&.Mui-disabled': {
                                    backgroundColor: "blue",
                                    color: "white",
                                    border: "1px solid #000000"
                                },
                                // 👇 Prevent focus color change
                                "&:hover": {
                                    backgroundColor: "#6B52AE",
                                    color: "#ffff"
                                },
                            }} variant="outlined">Active
                            <Box
                                sx={{
                                    marginX: 1,
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: "green",
                                    border: pagination?.status === true ? "1px solid #ffff" : '1px solid #000000',

                                }}
                            />
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            onClick={() => {
                                setPagination({
                                    page: 1,
                                    limit: 10,
                                    status: false
                                })
                            }}
                            sx={{
                                fontSize: "14px",
                                fontWeight: 200,
                                paddingY: 0.3,
                                borderRadius: 0.5,
                                border: "1px solid #000000",
                                color: pagination?.status === false ? '#ffff' : '#000000',
                                backgroundColor:
                                    pagination?.status === false ? "#6B52AE" : "#ffff",
                                '&.Mui-disabled': {
                                    backgroundColor: "blue",
                                    color: "white",
                                    border: "1px solid #000000"
                                },
                                "&:hover": {
                                    backgroundColor: "#6B52AE",
                                    color: "#ffff"
                                },
                            }} variant="outlined">Inactive
                            <Box
                                sx={{
                                    marginX: 1,
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: "orange",
                                    opacity: 0.4,
                                    border: pagination?.status === false ? "1px solid #ffff" : "1px solid #000000"
                                }}
                            />
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    }
    return (
        <>
            <Breadcrumbs
                back={false}
                heading="Templates"
                children={
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

            <CommonTable
                children={<Children />}
                loading={loading}
                totalCount={getNewTemplateListPagination?.totalHostels}
                setPagination={setPagination}
                pageIndex={pagination.page}
                pageSize={pagination.limit}
                onSelectionChange={setSelectedRows}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                data={getNewTemplateList}
                extraColumns={extraColumns} />
        </>
    )
}
