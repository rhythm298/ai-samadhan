import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardActions
} from '@mui/material';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    features: ['Basic templates', 'Download PDF', 'Share via link']
  },
  {
    name: 'Premium',
    price: '₹299',
    features: ['Premium templates', 'AI style suggestions', 'Email + WhatsApp invites']
  },
  {
    name: 'Business',
    price: '₹999',
    features: ['Admin Dashboard', 'Advanced analytics', 'Custom branding']
  }
];

const Pricing = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        💎 Pricing Plans
      </Typography>
      <Grid container spacing={3}>
        {plans.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5">{plan.name}</Typography>
                <Typography variant="h6" color="primary">{plan.price}</Typography>
                <ul>
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" color="primary">
                  Choose {plan.name}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Pricing;
