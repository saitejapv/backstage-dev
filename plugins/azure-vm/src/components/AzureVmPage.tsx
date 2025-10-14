import React from 'react';
import { Grid, Button, Typography, Paper, makeStyles } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { LaunchVmForm } from './LaunchVmForm';
import { VmList } from './VmList';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export const AzureVmPage = () => {
  const classes = useStyles();

  return (
    <Page themeId="tool">
      <Header title="Azure VM Manager" subtitle="Launch and manage Azure Virtual Machines">
        <SupportButton>Manage your Azure Virtual Machines</SupportButton>
      </Header>
      <Content>
        <ContentHeader title="Launch New VM" />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <LaunchVmForm />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Your VMs
              </Typography>
              <VmList />
            </Paper>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};