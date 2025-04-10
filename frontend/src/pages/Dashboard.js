import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Email, Edit, Visibility, Add, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's invitations (assumes token auth + API working)
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/invitations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvitations(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        🧾 Your Invitation Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Manage and track your wedding invitation designs, AI suggestions, and delivery history.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {invitations.length === 0 ? (
              <Typography variant="body1" sx={{ mx: 2 }}>
                You haven’t created any invitations yet.
              </Typography>
            ) : (
              invitations.map((invite, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Card sx={{ borderLeft: '5px solid #3f51b5' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {invite.template.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {invite.names?.en || 'Untitled Couple'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(invite.date).toLocaleDateString()} — {invite.venue?.en}
                          </Typography>
                        </Box>
                      </Box>

                      <Box mt={2}>
                        <Chip label={`Theme: ${invite.theme}`} size="small" sx={{ mr: 1 }} />
                        <Chip label={`Palette: ${invite.colorPalette}`} size="small" />
                      </Box>

                      <Box mt={2} display="flex" gap={1}>
                        <Button size="small" variant="outlined" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<Visibility />}>
                          Preview
                        </Button>
                        <Button size="small" variant="contained" startIcon={<Email />}>
                          Send
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          <Box textAlign="center" mt={5}>
            <Button variant="contained" size="large" startIcon={<Add />}>
              Create New Invitation
            </Button>
          </Box>
        </>
      )}

      <Divider sx={{ my: 5 }} />

      <Typography variant="h6" gutterBottom>
        📊 Quick Stats
      </Typography>
      <List dense>
        <ListItem>
          <CheckCircle color="success" sx={{ mr: 1 }} />
          <ListItemText primary="AI Suggestions used" secondary="5 this week" />
        </ListItem>
        <ListItem>
          <CheckCircle color="success" sx={{ mr: 1 }} />
          <ListItemText primary="PDF Invites Sent" secondary="12 total" />
        </ListItem>
        <ListItem>
          <CheckCircle color="success" sx={{ mr: 1 }} />
          <ListItemText primary="Templates Created" secondary={invitations.length} />
        </ListItem>
      </List>
    </Container>
  );
};

export default Dashboard;
