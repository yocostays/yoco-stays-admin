/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'

// import { getDashboardAsync } from '@redux/services/dashboard';
// import { dispatch } from '@redux/store';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';



const DashboardCard = () => {

  // const [fans, setFans] = useState(0);
  // const [user, setUser] = useState(0);
  // const [visit, setVisit] = useState(0);

  // useEffect(() => {
  //   dispatch(getDashboardAsync());
  // }, []);

  // const { dashboard } = useSelector((store) => store.dashboard);
  useEffect(() => {
    // setFans(dashboard.users.fans);
    // setUser(dashboard.Users);
    // setVisit(dashboard.Visit);
  }, []);
  // console.log('hostels',fans)
  const navigate = useNavigate();
  // eslint-disable-next-line no-shadow
  const handleCardClick = ({ path, status }) => {
    navigate(path, { state: { status } });
  };
  // const handleCardClick = (row) => {
  //   const { path } = row;
  //   // const queryParameters = data ? { data } : {};
  //   // navigate(path, { state: queryParameters });
  //   navigate(path)
  // };


  const Dashboard_values = [
    {
      id: 1,
      count: 29,
      title: "User",
      titleColor: " #000",
      titlebgColor: 'linear-gradient(335deg, rgba(144, 232, 255, 1) 20%, rgba(167, 246, 255, 0.6) 100%)',
      bgColor: "#C8FACD",
      status: 'user',
      path: '/dashboard/user/list'
    },
    {
      id: 2,
      title: "Leave",
      count: 29,
      titleColor: "#7A4100",
      titlebgColor: 'linear-gradient(335deg, rgba(144, 232, 255, 1) 20%, rgba(167, 246, 255, 0.6) 100%)',
      bgColor: "#FFF5CC",
      status: 'approved',
      path: '/dashboard/leave/list'
    },

    {
      id: 3,
     
      title: "Complain",
      count: 29,
      titleColor: "#005249",
      titlebgColor: 'linear-gradient(335deg, rgba(144, 232, 255, 1) 20%, rgba(167, 246, 255, 0.6) 100%)',
      bgColor: "#CAFDF5",
      status: 'incomplete',
      path: '/dashboard/maintenance/complain/list',
    },

    {
      id: 4,
      title: "Role",
      count: 29,
      titleColor: "rgb(184, 100, 225)",
      titlebgColor: 'linear-gradient(335deg, rgba(144, 232, 255, 1) 20%, rgba(167, 246, 255, 0.6) 100%)',
      bgColor: "rgb(214, 228, 255)",
      status: 'edit required',
      path: '/dashboard/role/list',
    },
    {
      id: 5,
      title: "Staff",
      count: 29,
      titleColor: "#005249",
      titlebgColor: 'linear-gradient(335deg, rgba(144, 232, 255, 1) 20%, rgba(167, 246, 255, 0.6) 100%)',
      bgColor: "rgb(139,450,200)",
      status: 'take down requested',
      path: '/dashboard/staff/list',
    },

    {
      id: 6,
      title: "Add Hostel ",
      count: 29,
      titleColor: "#003768",
      titlebgColor: 'linear-gradient(335deg, rgba(144, 232, 255, 1) 50%, rgba(167, 246, 255, 0.6) 80%)',
      bgColor: "#CAFDF5",
      status: 'take down',
      path: '/dashboard/addhostel/list',
    },

  ];


  return (

    <Grid container spacing={2} sx={{ padding: 1 }}>
      {Dashboard_values?.map((values, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index} >
          <Card sx={{
            backgroundColor: values.bgColor, cursor: 'pointer'
          }}
            onClick={() => handleCardClick({ path: values.path, status: values.status })}
          >
            <CardContent>
            <Box
                sx={{
                  height: "60px", 
                  width: "60px",
                  margin: "auto",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: values.titlebgColor,
                  my:2
                }}
              >
                <Typography variant="h5" sx={{ color: values.titleColor }}>
                  {values.count}
                </Typography>
              </Box>
                  <Box
                    sx={{
                      margin: "auto",
                      display: "grid",
                      alignItems: "center",
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: values.titleColor,
                      my:2
                    }}
                  >
                    <h3>{values.title}</h3>
                  </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default DashboardCard
