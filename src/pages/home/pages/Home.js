/* eslint-disable arrow-body-style */
import React from 'react'
import { Box } from '@mui/material'
import { Helmet } from 'react-helmet-async';
import DashboardCard from '../components/Card'

const Dashboard = () => {
  return (
    <>
    <Helmet>
    <title> Dashboard | YOCO  </title>
    </Helmet>
    <Box>
      <DashboardCard />
    </Box>
    </>
  )
}

export default Dashboard
