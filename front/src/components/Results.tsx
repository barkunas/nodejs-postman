import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { Component } from 'react'
import { IResultsProps } from './IResultsProps';


export default class Results extends Component<IResultsProps> {
    handleRefPreview = async (ref: HTMLIFrameElement | null) => {
        if (!this.props.innerRequestBody || !this.props.innerHeaders || !ref || !ref.contentDocument) return;/* 
        const iframe = document.createElement('iframe');
        ref.innerHTML = "";
        ref.append(iframe) */
        ref.contentDocument.open();
        ref.contentDocument.write(this.props.innerRequestBody);
        ref.contentDocument.close();
    }
    render() {
        console.log(this.props);
        const rowArray = [];
        for (const prop in this.props.innerHeaders) {
            const row = (
                <TableRow
                    key={prop}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {prop}
                    </TableCell>
                    <TableCell align="right">{this.props.innerHeaders[prop]}</TableCell>
                </TableRow>
            );
            rowArray.push(row)
        }
        if (!this.props.innerHeaders) return <div></div>

        return (
            <div className="CenterBlock">
                <div>url: {this.props.fetchUrl}</div>
                Response Headers
                <TableContainer component={Paper} sx={{ width: "74%" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                            {rowArray}
                        </TableBody>
                    </Table>
                </TableContainer>
                Response Body (short)
                <div style={{
                    width: "74%",
                    border: 'dashed',
                    borderColor: '#80808033'
                }}>
                    {this.props.innerRequestBody && this.props.innerRequestBody.slice(0, 255)}
                </div>
                Body Preview
                <div>
                    <p></p>
                    <iframe key={this.props.fetchUrl}
                        style={{
                            width: "74%",
                            height: "400px",
                            overflow: "auto"
                        }}
                        ref={this.handleRefPreview}
                    />
                </div>
            </div >
        )
    }
}
