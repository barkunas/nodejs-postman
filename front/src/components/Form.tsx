import { ChangeEvent, Component, SyntheticEvent } from 'react'
import { Button, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Box, Autocomplete } from '@mui/material'
import Results from './Results'
import { IResultsProps } from './IResultsProps'
import { contentTypes } from './contentTypes'
import { eventNames } from 'process'

const HTTP = "http://"
const DEFAULT_CONTENT_TYPE = "text/plain"

interface IFormStates {
    method: string,
    url: string,
    contenttype: string,
    isUrlCorrect: boolean,
    waitResponse: boolean,
    error: string,
    results: IResultsProps,
    query: string,
    queryCount: number,
    frontBody: ""
}
export default class Form extends Component {
    state: IFormStates = {
        method: "GET",
        url: "",
        contenttype: DEFAULT_CONTENT_TYPE,
        isUrlCorrect: true,
        waitResponse: false,
        error: "",
        results: {},
        query: "",
        queryCount: 1,
        frontBody: ""
    }
    handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ method: event.target.value });
    }
    handleContentTypeChange = (event: SyntheticEvent<Element, Event>, value: { label: string; } | null) => {
        var text = DEFAULT_CONTENT_TYPE;
        if (value) text = value.label;
        this.setState({ contenttype: text });
    }
    handleUrlInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        try {
            if (event.target.value.indexOf('.') < 1) throw new Error("invalid url");
            new URL(event.target.value);
            this.setState({
                url: event.target.value,
                isUrlCorrect: true
            });
        } catch (err) {
            this.setState({
                url: event.target.value,
                isUrlCorrect: false
            });
        }
    }
    handleGoBtn = async () => {
        this.setState({ waitResponse: true });
        const response = await fetch('/do', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                method: this.state.method,
                url: this.state.url,
                contenttype: this.state.contenttype,
                query: this.state.query
            })
        });
        const body = await response.json();
        this.setState({
            waitResponse: false,
            results: body
        });
    }
    handleQueryCahnge = (event: ChangeEvent<HTMLInputElement>) => {
        const targetElem = event.target;
        const mainParent = targetElem.closest('.QueryClass');
        if (!mainParent) return;
        const allInputs = mainParent.querySelectorAll('input');
        const queryArr: string[] = [];
        allInputs.forEach(elem => queryArr.push(elem.value));
        let newQuery = "?";
        for (let i = 0; i < queryArr.length; i += 2) {
            if (!queryArr[i]) continue;
            newQuery += `${queryArr[i]}=${queryArr[i + 1]}&`
        }
        newQuery = newQuery.slice(0, -1);
        this.setState({ query: newQuery });

    }
    handleAddQuery = () => {
        this.setState({ queryCount: this.state.queryCount + 1 });
    }
    handleMinusQuery = () => {
        this.setState({ queryCount: this.state.queryCount - 1 });
    }
    handleFrontBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            frontBody: event.target.value
        })
    }
    render() {
        const resultsObj = this.state.results;
        //const ResultsBlock = this.state.results && <Results {...resultsObj} />;
        return (
            <Box sx={{ fontFamily: 'default' }}>
                {(this.state.waitResponse)&&(<div className="Shadow"><div>Loading...</div></div>)}
                {(this.state.results.messages) && (<div className="QueryClass" style={{ color: 'red' }}>
                    <div>Server message:</div>
                    <div>{this.state.results.messages[0]}</div>
                </div>)}
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">METHOD</FormLabel>
                        <RadioGroup row aria-label="method" name="row-radio-buttons-group" onChange={this.handleSelectChange}>
                            <FormControlLabel checked={this.state.method === "GET"} value="GET" control={<Radio />} label="GET" />
                            <FormControlLabel checked={this.state.method === "POST"} value="POST" control={<Radio />} label="POST" />
                            <FormControlLabel checked={this.state.method === "PUT"} value="PUT" control={<Radio />} label="PUT" />
                            <FormControlLabel checked={this.state.method === "DELETE"} value="DELETE" control={<Radio />} label="DELETE" />
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
                            placeholder="http://onliner.by"
                            variant="outlined"
                            onChange={this.handleUrlInputChange}
                        />
                    </div>
                    <div className="QueryClass">
                        {(() => {
                            const arr = [];
                            for (let i = 0; i < this.state.queryCount; i++) {
                                const elem = (
                                    <div key={`queryCountKey${i}`}>
                                        <TextField onChange={this.handleQueryCahnge} id="outlined-basic" label="key" variant="outlined" />
                                        <TextField onChange={this.handleQueryCahnge} id="outlined-basic" label="value" variant="outlined" />
                                    </div>
                                );
                                arr.push(elem);
                            }
                            return arr;
                        })()}
                        <div>
                            <Button variant="contained" color="primary" onClick={this.handleAddQuery}>
                                +
                            </Button>
                            {(this.state.queryCount > 1) && (

                                <Button variant="contained" color="primary" onClick={this.handleMinusQuery}>
                                    -
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="CenterBlock">
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Body"
                            sx={{ width: 300 }}
                            multiline
                            maxRows={4}
                            value={this.state.frontBody}
                            onChange={this.handleFrontBodyChange}
                        />
                    </div>
                    <div className="CenterBlock">
                        <Autocomplete
                            disablePortal
                            id="content-type"
                            options={contentTypes}
                            sx={{ width: 300 }}
                            onChange={this.handleContentTypeChange}
                            renderInput={(params) => <TextField {...params} label="content-type" />}
                        />
                    </div>

                    <div>
                        <Button variant="contained" color="primary" onClick={this.handleGoBtn}>
                            GO
                        </Button>
                    </div>
                    <Results {...resultsObj} />
                </div>
            </Box >
        );
    }
}