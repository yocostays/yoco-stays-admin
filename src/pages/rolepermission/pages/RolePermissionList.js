import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';

import { Helmet } from 'react-helmet-async';
import _, { capitalize } from 'lodash';
import { LoadingButton } from '@mui/lab';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@routes/paths';
import { useSnackbar } from '@components/snackbar';
import { getAllRoutesAsync, createPermissions, getPermissionByID } from '@redux/services/permission';

const PermissionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const {
    permissionByRoleId,
    allRoutes,
    isLoading,
    isSubmitting,
  } = useSelector((state) => state?.permission);

  const [allCheck, setAllCheck] = useState(false);
  const [RoutesPermission, setRoutesPermission] = useState([]);
  const methods = useForm({});
  const { reset } = methods;

  // handle select all routes
  const handleAllCheck = (permission) => {
    const permissionall = _.map(RoutesPermission, (evv) => {
      if (evv.title === 'Dashboard') {
        return {
          ...evv,
          add: true,
          edit: true,
          view: true,
          delete: true,
        };
      }
      return {
        ...evv,
        add: permission,
        edit: permission,
        view: permission,
        delete: permission,
      };
    });

    setRoutesPermission(permissionall);
  };


  // checked indivisual
  const handleCheckPermission = (row, string, condition) => {
    const indexNum = RoutesPermission.findIndex((item) => item._id === row._id);
    let updateRow;
    if (string === 'add') {
      updateRow = { ...row, add: condition };
    } else if (string === 'edit') {
      updateRow = { ...row, edit: condition };
    } else if (string === 'view') {
      updateRow = {
        ...row,
        view: condition,
      };
      if (string === 'view' && condition === false) {
        updateRow = {
          ...updateRow,
          add: false,
          edit: false,
          delete: false,
        };
      }
    } else if (string === 'delete') {
      updateRow = { ...row, delete: condition };
    }
    else if (string === 'addRemark') {
      updateRow = { ...row, addRemark: condition };
    }
    else if (string === 'addMiscCost') {
      updateRow = { ...row, addMiscCost: condition };
    }
    if (indexNum !== -1) {
      const stateInfo = [...RoutesPermission];
      stateInfo.splice(indexNum, 1, { ...stateInfo[indexNum], ...updateRow });

      setRoutesPermission(stateInfo);
      // Check if any row is unselected, and update the "Select All" checkbox accordingly
      // const anyUnselected = stateInfo?.some(
      //   (item) => !item.view || !item.edit || !item.add || !item.delete
      // );
      // setAllCheck(!anyUnselected);

      // Check if all individual checkboxes are checked
      const allChecked = stateInfo.every(
        (item) => item.view && item.edit && item.add && item.delete
      );
      setAllCheck(allChecked);
    }
  };

  const onSubmit = async (data) => {
    try {
      const permissionInfo = RoutesPermission?.filter((ev) => ev.view === true)?.map((ev) => ({
        routeId: ev._id,
        add: ev.add,
        edit: ev.edit,
        delete: ev.delete,
        view: ev.view,
      }));

      const payload = { roleId: id, permission: permissionInfo }
      console.log('payload', payload)

      const response = await dispatch(createPermissions(payload));

      if (response?.payload?.statusCode === 200) {
        reset();
        console.log('response', response)
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.role.list);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (permissionByRoleId?.length > 0 && allRoutes?.length > 0) {
      const updatedRoutes = RoutesPermission.map((route) => {
        const filterInfo = permissionByRoleId?.find((permission) => permission?._id === route?._id);

        if (filterInfo) {
          return {
            ...route,
            add: filterInfo.add,
            edit: filterInfo.edit,
            view: filterInfo.view,
            delete: filterInfo.delete,
          };
        }
        return route;
      });

      setRoutesPermission(updatedRoutes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionByRoleId, allRoutes]);

  useEffect(() => {
    // required later
    if (allRoutes) {
      const mapRoute = _.map(allRoutes, (item) => {
        if (item.title === 'Dashboard') {
          return {
            ...item,
            add: true,
            edit: true,
            delete: true,
            view: true,
          };
        }
        return item;
      });
      setRoutesPermission(mapRoute);
    }


  }, [allRoutes]);

  useEffect(() => {
    dispatch(getAllRoutesAsync()).then((ev) => {
      if (id) {
        const res = dispatch(getPermissionByID({ roleId: id }));
        console.log('res', res)
      }
    });
  }, [dispatch, id]);


  return (
    <>
      <Helmet>
        <title>Permission | YOCO</title>
      </Helmet>

      <Container>
        <CustomBreadcrumbs
          heading="Permission List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Role', href: PATH_DASHBOARD.role.list },
            { name: 'Permission List' },
          ]}
          action={
            <Stack alignItems="flex-end" sx={{ mt: 5 }}>
              <LoadingButton
                type="button"
                variant="contained"
                onClick={onSubmit}
                loading={isSubmitting}
              >
                Assign Permission
              </LoadingButton>
            </Stack>
          }
        />

        <Box>
          <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
            {/* chacked for all route  */}
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h4"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '15px !important',
                  lineHeight: '30px !important',
                  fontWeight: '500 !important',
                }}
              >
                <Checkbox
                  sx={{
                    p: 0,
                    mr: 1,
                  }}
                  checked={allCheck}
                  onClick={(e) => {
                    setAllCheck(e.target.checked);
                    handleAllCheck(e.target.checked);
                  }}
                />{' '}
                Select All
              </Typography>
            </Box>

            <Table aria-label="customized table" sx={{ marginTop: '21px' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                  >
                    MODULE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    VIEW
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    EDIT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    CREATE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    DELETE
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>{isLoading ? (
                <TableCell colSpan={12}>
                  <Box
                    sx={{
                      height: '50vh',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress color="primary" />
                  </Box>
                </TableCell>
              ) : (
                <>
                  {RoutesPermission?.length > 0 &&
                    RoutesPermission?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row" sx={{ py: '12px !important' }}>
                          {capitalize(row?.title)}
                        </TableCell>
                        <TableCell align="right" sx={{ py: '0px !important' }}>
                          <Checkbox
                            checked={row.view}
                            onChange={(e) => {
                              const permission = !row.view;
                              handleCheckPermission(row, 'view', permission);
                            }}
                            disabled={Boolean(row.title === 'Dashboard')}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: '0px !important' }}>
                          <Checkbox
                            checked={row.edit}
                            onChange={(e) => {
                              const permission = !row.edit;
                              handleCheckPermission(row, 'edit', permission);
                            }}

                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: '0px !important' }}>
                          <Checkbox
                            checked={row.add}
                            onChange={(e) => {
                              const permission = !row.add;
                              handleCheckPermission(row, 'add', permission);
                            }}

                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: '0px !important' }}>
                          <Checkbox
                            checked={row.delete}
                            onChange={(e) => {
                              const permission = !row.delete;
                              handleCheckPermission(row, 'delete', permission);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default PermissionList;
