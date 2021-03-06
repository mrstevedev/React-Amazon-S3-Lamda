import React, { Component, Fragment } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import config from '../config.json';
import axios from 'axios';
import { validateEmail } from '../util/validate';

const styles = {
  formGroup: {
    padding: '2rem'
  },

  form: {
    display: 'flex', 
    flexDirection: 'column'
  },
  headerStyles: {
    padding: '0 2rem',
    textTransform: 'uppercase',
    fontSize: '1rem',
    margin: '0.7rem'
  },
  successMsg: {
    padding: '1rem', 
    background: 'rgb(98, 181, 158)',
    fontWeight: '500',
    color: '#fff'
  },
  sendIcon: {
    fontSize: '18px', 
    marginLeft: '5px'
  }
};
export class UserForm extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      name: '',
      email: '',
      message: '',
      isSuccess: false,
      data: {},
      errorName: false,
      errorEmail: false,
      errorMessage: false
    };
  }
  
  handleChange = (field, value) => {
    this.setState({ [field]: value });
    const { name, email, message } = this.state;
    if(name !== '') {
      this.setState({ errorName: false });
    }
    if(email !== '') {
      this.setState({ errorEmail: false });
    }
    if(message !=='') {
      this.setState({ errorMessage: false });
    }
   }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { message, name, email } = this.state;

    if(name === '') {
      this.setState({ errorName: true });
    }
    if(email === '') {
      this.setState({ errorEmail: true });
    }
    if(message === '') {
      this.setState({ errorMessage: true });
    } else {
    
    await axios.post(`${ config.api.invokeUrl }/submit`, 
    { name: `${ name }`,
      email: `${ email }`, 
      message: `${ message }`, } )
      .then(res => {
        this.setState({ data: res.config, isSuccess: true })
      })
    }
  }

  render() {
    const { isSuccess } = this.state;
    return (
      <Fragment>
        <Grid
            container
            spacing={0}
            direction="column"
            justify="center"
            style={{ height: '50vh' }}>
          <FormGroup style={styles.formGroup}>
            <form onSubmit={this.handleSubmit} style={ styles.form }>
              { isSuccess === true ? 
              <div style={styles.successMsg}>Thank you, your message was sent successfully
              </div> : '' 
              }
            <FormControl margin="normal">
              <InputLabel htmlFor="my-input">Name</InputLabel>
              <Input 
                id="my-input" 
                aria-describedby="my-helper-text" 
                onChange={(e) => this.handleChange('name', e.target.value)} 
                error={!!this.state.errorName}
              />
              <FormHelperText id="my-helper-text">
                { this.state.errorName === true ? (
                  <span className="error-txt">Name is required</span>
                ) : this.state.name !== '' ? (
                  <span className="success-txt">You successully entered your name</span>
                ) : 'Please enter your name.' }
              </FormHelperText>
            </FormControl>
            <FormControl margin="normal">
              <InputLabel htmlFor="my-input">Email address</InputLabel>
              <Input
                type="email"
                id="my-input" 
                aria-describedby="my-helper-text" 
                error={!!this.state.errorEmail}
                onChange={(e) => this.handleChange('email', e.target.value)}
                />
              <FormHelperText id="my-helper-text">
                { this.state.errorEmail === true ? (
                  <span className="error-txt">Email is required</span>
                ) : this.state.email !== '' && validateEmail(this.state.email) ? (
                  <span className="success-txt">You successully entered your email</span>
                ) : "Please enter your email." }
              </FormHelperText>
            </FormControl>
            <FormControl margin="normal">
              <InputLabel htmlFor="my-input">Message</InputLabel>
              <Input 
                id="my-input" 
                aria-describedby="my-helper-text"
                onChange={(e) => this.handleChange('message', e.target.value)} 
                error={!!this.state.errorMessage}
                />
              <FormHelperText id="my-helper-text">
                { this.state.errorMessage === true ? (
                  <span className="error-txt">Message is required</span>
                ) : this.state.message !== '' ? (
                  <span className="success-txt">You successully entered your message</span>
                ) : 'Please enter your message.' }
              </FormHelperText>
            </FormControl>
            <FormControl margin="normal">
              <Button 
                type="submit"
                fullWidth
                color="primary"
                className="submit-btn"
              >Send Message <span className="material-icons" style={ styles.sendIcon }>send</span>
              </Button>
            </FormControl>
            </form>
          </FormGroup>         
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(UserForm);
