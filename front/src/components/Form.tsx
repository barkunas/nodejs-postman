import { ChangeEvent, Component } from 'react'
import { Button, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Box } from '@mui/material'

const HTTP = "http://"

export default class Form extends Component {
    state = {
        method: "GET",
        url: "",
        isUrlCorrect: true,
        waitResponse: false,
        error: ""
    }
    handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ method: event.target.value });
    }
    handleUrlInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        try {
            new URL(HTTP + event.target.value)
            this.setState({
                url: HTTP + event.target.value,
                isUrlCorrect: true
            })
        } catch (err) {
            console.log('url isnt correct')
            this.setState({
                url: event.target.value,
                isUrlCorrect: false
            })
        }
    }
    handleGoBtn = async () => {
        this.setState({ waitResponse: true })
        const response = await fetch('/do', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state)
        })
        const body = await response.json();
        this.setState({ waitResponse: false })
        console.log(body)
    }
    render() {
        return (
            <Box sx={{ fontFamily: 'default' }}>
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">METHOD</FormLabel>
                        <RadioGroup row aria-label="method" name="row-radio-buttons-group" onChange={this.handleSelectChange}>
                            <FormControlLabel value="GET" control={<Radio />} label="GET" />
                            <FormControlLabel value="POST" control={<Radio />} label="POST" />
                            <FormControlLabel value="PUT" control={<Radio />} label="PUT" />
                            <FormControlLabel value="DELETE" control={<Radio />} label="DELETE" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <div>
                        <h3>{HTTP}</h3>
                        <TextField
                            error={!this.state.isUrlCorrect}
                            id="outlined-basic"
                            label="URL"
                            variant="outlined"
                            onChange={this.handleUrlInputChange}
                        />
                    </div>
                    <div >
                        <TextField id="outlined-basic" label="key" variant="outlined" />
                        <TextField id="outlined-basic" label="value" variant="outlined" />
                    </div>
                    <div >
                        <TextField id="outlined-basic" label="key" variant="outlined" />
                        <TextField id="outlined-basic" label="value" variant="outlined" />
                    </div>

                    <div>
                        <Button variant="contained" color="primary" onClick={this.handleGoBtn}>
                            GO
                        </Button>
                    </div>
                </div>
            </Box >
        )
    }
}
