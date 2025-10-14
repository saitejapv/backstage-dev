import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

export const LaunchVmForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    image: '',
    resourceGroup: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement VM creation logic using Azure SDK
    console.log('Launching VM with data:', formData);
  };

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name!]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            name="name"
            label="VM Name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.formControl}>
            <InputLabel>VM Size</InputLabel>
            <Select
              required
              name="size"
              value={formData.size}
              onChange={handleChange}
            >
              <MenuItem value="Standard_B2s">Standard B2s (2 vCPU, 4 GB RAM)</MenuItem>
              <MenuItem value="Standard_D2s_v3">Standard D2s v3 (2 vCPU, 8 GB RAM)</MenuItem>
              <MenuItem value="Standard_D4s_v3">Standard D4s v3 (4 vCPU, 16 GB RAM)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.formControl}>
            <InputLabel>Custom Image</InputLabel>
            <Select
              required
              name="image"
              value={formData.image}
              onChange={handleChange}
            >
              {/* TODO: Fetch these dynamically from Azure */}
              <MenuItem value="image1">Development Image</MenuItem>
              <MenuItem value="image2">Production Image</MenuItem>
              <MenuItem value="image3">Testing Image</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            name="resourceGroup"
            label="Resource Group"
            value={formData.resourceGroup}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submitButton}
          >
            Launch VM
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};