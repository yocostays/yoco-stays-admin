import Iconify from "@components/iconify";
import { Box, Button, Typography } from "@mui/material";
import { PATH_DASHBOARD } from "@routes/paths";
import { Link as RouterLink, useNavigate, useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PropTypes from 'prop-types';

export default function Breadcrumbs({
    children,
    back = false,
    heading = ''
}) {
    // const lastLink = links[links.length - 1].name;
    const navigate = useNavigate();

    return (
        <Box sx={{
            marginY: 1.5,
            display: "flex",
            justifyContent: "space-between"
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
            }}>
                {
                    back && (
                        <ArrowBackIosIcon
                            sx={{
                                fontSize: 22,
                                cursor: "pointer"
                            }} onClick={() => navigate(-1)} />
                    )
                }

                <Typography sx={{ textAlign: "center", marginY: "auto" }} variant="h5" gutterBottom>{heading}</Typography>
            </Box>
            {children}
        </Box>
    );
}

Breadcrumbs.propTypes = {
    back: PropTypes.bool,
    children: PropTypes.node,
    heading: PropTypes.string
};
