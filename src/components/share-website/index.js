import React from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import styled from 'styled-components';
import Button from 'antd/lib/button';


const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

const ShareWebsiteBody = styled.div`
    padding: 30px 50px;
`;

const BaseFormItem = styled(FormItem)`
    width: 600px;
`;

const BaseInput = styled(Input)`
    width: 100% !important;
`;

const selectBefore = (
    <Select defaultValue="https://" style={{width: 90}}>
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
    </Select>
);
const selectAfter = (
    <Select defaultValue=".com" style={{width: 80}}>
        <Option value=".com">.com</Option>
        <Option value=".jp">.jp</Option>
        <Option value=".cn">.cn</Option>
        <Option value=".org">.org</Option>
        <Option value=".top">.top</Option>
        <Option value=".club">.club</Option>
    </Select>
);

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class CustomizedForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    render() {
        const {onSubmit, loading} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        // Only show error after a field is touched.
        const titleError = isFieldTouched('title') && getFieldError('title');
        const websiteError = isFieldTouched('website') && getFieldError('website');
        const categoryError = isFieldTouched('category') && getFieldError('category');
        const descriptionError = isFieldTouched('description') && getFieldError('description');
        return (
            <Form layout={'horizontal'} onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
            }} hideRequiredMark={false}
                  style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                  }}>
                <BaseFormItem
                    validateStatus={titleError ? 'error' : ''}
                    help={titleError || ''}
                    label="网站标题"
                >
                    {
                        getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                message: '网站标题不能为空'
                            }]
                        })(<BaseInput placeholder="在此输入网站标题"/>)
                    }
                </BaseFormItem>
                <BaseFormItem
                    label="网站主页"
                    validateStatus={websiteError ? 'error' : ''}
                    help={websiteError || ''}
                >
                    {
                        getFieldDecorator('website', {
                            rules: [{
                                required: true,
                                message: '网站主页不能为空'
                            }]
                        })(<BaseInput
                            // addonBefore={selectBefore}
                            //           addonAfter={selectAfter}
                                      placeholder="例如: https://qjm253.cn"/>)
                    }
                </BaseFormItem>
                <BaseFormItem
                    label="网站类别"
                    validateStatus={categoryError ? 'error' : ''}
                    help={categoryError || ''}
                >
                    {
                        getFieldDecorator('category', {
                            rules: [{
                                required: true,
                                message: '请选择一个网站类别'
                            }]
                        })(<Select placeholder="选择网站类别" allowClear={true}>
                            <Option value="科技数码">科技数码</Option>
                            <Option value="工具">工具</Option>
                            <Option value="新闻">新闻</Option>
                            <Option value="影视视频">影视视频</Option>
                            <Option value="直播">直播</Option>
                            <Option value="电子书">电子书</Option>
                            <Option value="游戏">游戏</Option>
                            <Option value="漫画">漫画</Option>
                            <Option value="图片">图片</Option>
                        </Select>)
                    }
                </BaseFormItem>
                <BaseFormItem
                    label="网站描述"
                    validateStatus={descriptionError ? 'error' : ''}
                    help={descriptionError || ''}
                >
                    {
                        getFieldDecorator('description', {
                            rules: [{
                                required: true,
                                message: '请输入网站描述'
                            }]
                        })(<TextArea placeholder="在此输入网站描述" rows={4}/>)
                    }
                </BaseFormItem>
                <BaseFormItem>
                    <Button type={'primary'} htmlType="submit" size={'large'} loading={!!loading}
                            disabled={hasErrors(getFieldsError())} >
                        分享
                    </Button>
                </BaseFormItem>
            </Form>
        );
    }
}

const EnhanceForm = Form.create({
    onFieldsChange(props, changedFields) {
        console.log(changedFields);
        props.onChange && props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            title: Form.createFormField({
                ...props.title,
                value: props.title.value,
            }),
            website: Form.createFormField({
                ...props.website,
                value: props.website.value,
            }),
            category: Form.createFormField({
                ...props.category,
                value: props.category.value,
            }),
            description: Form.createFormField({
                ...props.description,
                value: props.description.value,
            })
        }
    },

})(CustomizedForm);

class ShareWebsiteComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            fields: {
                username: {
                    value: 'benjycui',
                },
            },
        };
    }

    handleFormChange(changedFields) {
        let {updateFields} = this.props;
        updateFields(changedFields);
    }

    handleSubmit(){
        let {shareWebsite} = this.props;
        shareWebsite(this.props);
    }

    render() {
        return (
            <ShareWebsiteBody>
                <EnhanceForm {...this.props} onChange={this.handleFormChange} onSubmit={this.handleSubmit}/>
            </ShareWebsiteBody>
        );
    }
}

export default ShareWebsiteComponent;