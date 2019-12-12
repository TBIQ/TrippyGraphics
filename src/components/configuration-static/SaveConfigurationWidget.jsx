import React, { useEffect, useState } from "react"; 
import { Row, Col, Input, Form, Button } from "antd"; 
import { useRootContext } from "../../context/context"; 

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function SaveConfigurationWidget(props) {

    /*
    Allow user to name and save current static configuration
    */
    const { form } = props; 
    const { state, dispatch } = useRootContext(); 
    const { configs } = state; 
    const [firstRender, setFirstRender] = useState(true); 
    const configKeys = Object.keys(configs); 

    useEffect(() => {
        // indicate first render has occurred 
        setFirstRender(true); 
    }, []); 

    useEffect(() => {
        // Disable submit at the beginning as user has not yet entered input
        form.validateFields();
    }, []); 

    let handleSubmit = e => {
        e.preventDefault();
        form.validateFields((err, values) => {
            let formIsValid = !err; 
            if (formIsValid) {
                let { name } = values; 
                // TODO: dispatch creation of new confguration here 
            }
        });
    };

    let validateNewConfigName = (rule, value, callback) => {
        if (configKeys.includes(value)) {
            callback("Enter an unused name"); 
        } else {
            callback(); 
        }
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
                            rules: [
                                { required: true, message: 'Enter a non-empty name' }, 
                                { validator: validateNewConfigName }
                            ],
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
                        ghost 
                        disabled={firstRender || hasErrors(form.getFieldsError())}
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