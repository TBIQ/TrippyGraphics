import React, { useEffect } from "react"; 
import { Row, Col, Input, Form, Button } from "antd"; 

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function SaveConfigurationWidget(props) {

    /*
    Allow user to name and save current static configuration
    */
    const { form } = props; 

    useEffect(() => {
        // Disable submit at the beginning as user has not yet entered input
        form.validateFields();
    }, []); 

    let handleSubmit = e => {
        e.preventDefault();
        form.validateFields((err, values) => {
            let formIsValid = !err; 
            if (formIsValid) {
                console.log('Received values of form: ', values);
            }
        });
    };

    // Only show error after a field is touched.
    const configNameError = form.isFieldTouched('name') && form.getFieldError('name');

    return (
        <Row>
            <Col>
                <Form layout="inline" onSubmit={handleSubmit}>

                    {/* Input for name of new configuration */}
                    <Form.Item 
                    validateStatus={configNameError ? 'error' : ''} 
                    help={configNameError || ''}
                    >
                        {form.getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Enter an unused and non-empty name!' }],
                        })(
                            <Input 
                            style={{ width: 250 }}
                            placeholder="Enter Name for Configuration"
                            maxLength={25}
                            allowClear
                            />
                        )}
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button 
                        type="primary" 
                        htmlType="submit" 
                        disabled={hasErrors(form.getFieldsError())}
                        >
                            Save
                        </Button>
                    </Form.Item>

                </Form>
            </Col>
        </Row>
    ); 


}

const SaveConfigurationForm = Form.create({ name: 'create_config' })(SaveConfigurationWidget);

export default SaveConfigurationForm; 