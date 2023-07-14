import "./App.css";
import {
  Typography,
  Tag,
  Button,
  Divider,
  Space,
  Toast,
  Input,
  Select,
  Form,
} from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { IFieldMeta, FieldType, IWidgetField, IWidgetTable, TableMeta, bitable } from "@bitable/simple-api";
import { useEffect, useRef, useState } from "react";
import { FiledTypesDesc, replaceCells, ReplaceInfos, SupportField } from './utils'
import DiffCard from "./components/DiffCard";





//@ts-ignore
window.bitable = bitable

const supportFieldType = Object.keys(FiledTypesDesc)

export const icons: Record<SupportField, any> = {
  [FieldType.Text]: <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-8Zm1 7a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Zm3 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Zm-3.201 4.223-2.449-5.946H4.77a1.16 1.16 0 0 1-.187-.016L2.498 21.17a1.105 1.105 0 1 1-2.084-.736L6.562 3.013c.507-1.435 2.517-1.486 3.096-.08l7.184 17.448a1.105 1.105 0 0 1-2.043.841ZM8.165 5.113l-2.808 7.954h6.083L8.165 5.112Z" fill="#2B2F36" />
  </svg>
  ,
  [FieldType.Phone]: <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.341 15.332c-.726.574-2.054 1.092-3.386.367-.816-.445-1.67-1.17-2.536-2.035-.87-.87-1.596-1.726-2.04-2.546-.717-1.322-.21-2.638.353-3.361l.215-.277-1.675-3.909L3.754 5.02c.15 2.762.926 6.583 4.827 10.483 3.9 3.9 7.72 4.677 10.482 4.826l1.45-3.518-3.915-1.682-.257.204ZM2.961 3.183 6.51 1.722a2 2 0 0 1 2.6 1.061l1.675 3.91a2 2 0 0 1-.26 2.016l-.215.276c-.267.344-.381.796-.173 1.18.306.565.872 1.26 1.696 2.084.822.822 1.514 1.386 2.079 1.693.386.211.843.094 1.188-.179l.257-.204a2 2 0 0 1 2.031-.269l3.914 1.682a2 2 0 0 1 1.06 2.599l-1.463 3.551c-.308.75-1.038 1.249-1.848 1.208-3.116-.155-7.5-1.03-11.885-5.414-4.384-4.384-5.259-8.768-5.414-11.885-.04-.81.459-1.539 1.208-1.848Z" fill="#2B2F36" />
  </svg>
  ,
  [FieldType.Number]: <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.774 2.14a1 1 0 0 1 .85 1.129L9.242 6h6.98l.423-3.01a1 1 0 1 1 1.98.279L18.242 6H22a1 1 0 1 1 0 2h-4.04l-.984 7H20a1 1 0 1 1 0 2h-3.305l-.575 4.093a1 1 0 1 1-1.98-.278L14.674 17h-6.98l-.575 4.093a1 1 0 1 1-1.98-.278L5.674 17H2a1 1 0 1 1 0-2h3.956l.984-7H4a1 1 0 1 1 0-2h3.221l.423-3.01a1 1 0 0 1 1.13-.85ZM14.956 15l.984-7H8.96l-.984 7h6.98Z" fill="#2B2F36" />
  </svg>
  ,
  [FieldType.Url]: <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.849 2.699a5.037 5.037 0 0 0-7.1.97L8.97 7.372a4.784 4.784 0 0 0 .957 6.699l.972.729a1 1 0 0 0 1.2-1.6l-.972-.73a2.784 2.784 0 0 1-.557-3.898l2.777-3.703a3.037 3.037 0 1 1 4.8 3.72l-1.429 1.786a1 1 0 1 0 1.562 1.25l1.43-1.788a5.037 5.037 0 0 0-.862-7.138Z" fill="#2B2F36" />
    <path d="M5.152 21.301a5.037 5.037 0 0 0 7.1-.97l2.777-3.703a4.784 4.784 0 0 0-.957-6.699L13.1 9.2a1 1 0 0 0-1.2 1.6l.973.73a2.784 2.784 0 0 1 .556 3.898l-2.777 3.703a3.037 3.037 0 1 1-4.8-3.72l1.429-1.786a1 1 0 0 0-1.562-1.25l-1.43 1.787a5.037 5.037 0 0 0 .863 7.14Z" fill="#2B2F36" />
  </svg>

}

/** 选择所有 (字段/table/view) */
const ALL = 'all'


type AllFieldMetaLists = { table: IWidgetTable, fieldMetaList: IFieldMeta[], name: string }[]

export default function App() {
  const [findBtnLoading, setFindBtnLoading] = useState(false);
  // 得到结果的时间戳，控制每次得到结果的时候重新挂载结果
  const [resultKey, setResultKey] = useState(0)
  // 设置成功的结果的时间戳
  const [latestSuccessResultKey, setlatestSuccessResultKey] = useState<number>()
  // 查找按钮是否禁用
  const [disable, setDisable] = useState(true);
  // 所有查找替换的信息
  const [replaceInfos, setReplaceInfos] = useState<ReplaceInfos | undefined>()
  const [replaceAllLoading, setReplaceAllLoading] = useState(false)
  const [selection, setSelection] = useState<{ table: IWidgetTable, tableId: string }>();
  // 成功设置的单元格fieldId;recordId
  const [successed, setSeccessed] = useState<string[]>([])
  const [tableMetaList, setTableMetaList] = useState<TableMeta[]>()
  // 所选table下的所有fieldMetalist，暂时只能选一个table，所以长度为最多为1
  const [fieldMetaList, setFieldMetaList] = useState<AllFieldMetaLists>()
  const formApi = useRef<FormApi>()

  useEffect(() => {
    window.location.hash = 'id' + resultKey;
  }, [resultKey])

  const onSelectTable = (tableIdArr: any) => {
    // 先只做单选一个数据表
    if (!Array.isArray(tableIdArr)) {
      tableIdArr = [tableIdArr]
    }
    formApi.current?.setValue('field', ALL)
    Promise.allSettled(tableIdArr.map((tableId: string) => bitable.base.getTableById(tableId))).then(res => {
      const allTable: IWidgetTable[] = [];
      res.forEach((v: { status: "rejected" | "fulfilled", value?: IWidgetTable, reason?: any }) => {
        if (v.value) {
          allTable.push(v.value);
        } else {
          console.error(v.reason)
        }
      });
      // info.current.table = allTable;
      Promise.allSettled(allTable.map(async (t) => {
        const name = tableMetaList?.find((meta) => t.id === meta.id)?.name
        const fieldMetaLists = await t.getFieldMetaList()
        return {
          table: t,
          name: name || '',
          fieldMetaList: fieldMetaLists
        }
      })).then(fieldMetaLists => {
        const allFieldMetaList: AllFieldMetaLists = []
        fieldMetaLists.forEach((f: { status: "rejected" | "fulfilled", value?: { table: IWidgetTable, fieldMetaList: IFieldMeta[], name: string }, reason?: any }) => {
          if (f.value) {
            allFieldMetaList.push(f.value)
          } else {
            console.error(f.reason)
          }
        });
        setFieldMetaList(allFieldMetaList)
      })
    })

  }

  useEffect(() => {
    bitable.base.getTableMetaList().then((list) => {
      setTableMetaList(list)
    });
  }, []);

  useEffect(() => {
    async function getSelection() {
      const selection = await bitable.base.getSelection();
      const table = await bitable.base.getTableById(selection.tableId!);
      setSelection({
        table,
        tableId: table.id
      });
      onSelectTable([table.id])
    }
    if (tableMetaList) {
      getSelection()
    }
  }, [tableMetaList])


  if (!selection) {
    return <div>获取数据表失败</div>;
  }



  const getFormApi = (form: any) => {
    formApi.current = form
  }

  const replace = async () => {
    const formValues = formApi.current?.getValues();
    if (formValues) {
      let { findCell, replaceBy, field, table: choosedTableId, view } = formValues;
      field = [field]
      /** 所选table实例 */
      let _table: IWidgetTable
      if (choosedTableId === selection.tableId) {
        _table = selection.table
      } else {
        _table = await bitable.base.getTableById(choosedTableId)
      }
      /** 所有filed实例 */
      let fields: IWidgetField[] = []

      if (!view || view === ALL) {
        fields = await _table.getFieldList()
      } else {
        // fields = await selection.view.getVisibleFieldList();
        // TODO 暂时还没有可以获取当前视图可见字段的api
      }
      const fieldsType = await Promise.all(fields.map(async (f) => {
        const type = await f.getType()
        return {
          type,
          field: f
        }
      }))
      /** 过滤出的支持查找替换的字段 */
      let filteredFields = fieldsType.filter(({ type }) => {
        // @ts-ignore
        if (supportFieldType.includes(+type) || supportFieldType.includes(String(type))) {
          return true
        }
      }).map(({ field }) => field)

      if (!field.includes(ALL)) {
        const choosedFieldIds = field.map((f: string) => {
          const [fieldTableId, fieldId, fieldType] = f.split(';')
          return fieldId
        })
        filteredFields = filteredFields.filter((f) => choosedFieldIds.includes(f.id))
      }

      return filteredFields.map((f) => {
        return replaceCells({
          field: f as any,
          table: _table as any,
          findCell: {
            text: findCell ?? '', //TODO 暂时先只替换复杂字段的这些字段
            link: findCell ?? '',
            __value: findCell ?? ''
          },
          replaceBy: {
            text: replaceBy ?? '', //TODO findCell和replaceBy一样的时候直接不处理
            link: replaceBy ?? '',
            __value: replaceBy ?? ''
          },
        })
      })

    }
  }
  // const singleCellValueTypes = (choosedFieldMeta?.type && Object.values(FiledTypesDesc[choosedFieldMeta?.type])) || []
  const renderFieldSelection = () => (Array.isArray(fieldMetaList) && fieldMetaList.map((fieldMetaInfo) => {
    const selections = fieldMetaInfo.fieldMetaList.filter((v) => supportFieldType.includes(String(v.type))).map(({ name, id, type }) => {
      // @ts-ignore
      const Icon = icons[type]
      return <Form.Select.Option
        key={id}
        value={fieldMetaInfo.table.id + ';' + id + ';' + type}>
        {Icon} <div className="semi-select-option-text">{name}</div>
      </Form.Select.Option>
    });
    return [<Form.Select.Option
      key={ALL}
      value={ALL}>
      所有字段
    </Form.Select.Option>].concat(selections)
  }).flat(9))


  const onClickReplaceAllbtn = async () => {
    if (Array.isArray(replaceInfos) && replaceInfos.length) {
      const waitReplace: Promise<any>[] = []
      setReplaceAllLoading(true);
      replaceInfos.forEach((v: ReplaceInfos) => {
        waitReplace.push(v.replaceAll());
      })
      const res = await Promise.allSettled(waitReplace)
      setReplaceAllLoading(false)
      const successArr = res.map((v) => v.status == 'fulfilled' ? v.value.success : undefined).flat(9).map((v) => v.value.fieldIdRecordId)
      const failedArr = res.map((v) => v.status == 'fulfilled' ? v.value.failed : undefined).flat(9).map((v) => v.value.fieldIdRecordId)
      setSeccessed(successArr);
      if (failedArr.length) {
        Toast.success(`成功设置${successArr.length}个单元格，失败${failedArr.length}个单元格`);
        return;
      }
      setlatestSuccessResultKey(resultKey);
      Toast.success(`成功设置${successArr.length}个单元格`);
    }
  }
  const onClickFindBtn = async () => {
    setFindBtnLoading(true);
    setSeccessed([])
    try {
      try {
        const v = await replace();
        if (v) {
          Promise.allSettled(v).then((findRes) => {
            //@ts-ignore
            const findResArr = findRes.filter((r) => r.value && r.value.toSetList.length);
            if (findRes.length) {
              // @ts-ignore
              setReplaceInfos(findResArr.map((r_1) => r_1.value));
              setResultKey(new Date().getTime());
            }
          });
        }
      } catch (e) {
        console.error(e);
        Toast.error('错误:' + e);
      }
    } finally {
      setFindBtnLoading(false);
    }
  }

  const formValues = formApi.current?.getValues()
  const { table } = formValues || {}

  const onFormChange = () => {
    const { table, field, findCell } = formApi.current?.getValues()
    if ((table === undefined || field === undefined || findCell === undefined)) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }

  /** 是否有匹配结果 */
  const withResult = Array.isArray(replaceInfos) && replaceInfos.length > 0


  return (
    <div className="container" >
      <Form disabled={replaceAllLoading} onChange={onFormChange} getFormApi={getFormApi}>
        <div > <Form.Select initValue={selection.tableId} onChange={onSelectTable} field="table" label="选择数据表" placeholder="请选择">
          {
            Array.isArray(tableMetaList) && tableMetaList.map((tableMeta => <Form.Select.Option key={tableMeta.id} value={tableMeta.id}>{tableMeta.name}</Form.Select.Option>))
          }
        </Form.Select>
          {/* {selection.tableId && fieldMetaList?.[0].table.id && <Form.Select onChange={onSelectView} initValue={selection.tableId === fieldMetaList?.[0].table.id ? CURRENT : ALL} label='view' placeholder='请选择视图' field="view">
            <Form.Select.Option value={ALL} key={ALL}>
              所有视图
            </Form.Select.Option>
            {selection.tableId === fieldMetaList?.[0].table.id && <Form.Select.Option value={CURRENT} key={CURRENT}>
              当前视图
            </Form.Select.Option>}
          </Form.Select>} */}
          <Form.Select key={table?.id || 'field'} initValue={ALL} /*onChange={onSelectField}*/ field="field" label="选择字段" placeholder="请选择">
            {
              renderFieldSelection()
            }
          </Form.Select></div>


        {/* {choosedFieldMeta?.type && <Form.Select label={`字段存在${singleCellValueTypes.length}种类型,选择需要替换的类型：`} initValue={singleCellValueTypes.filter((desc) => desc.default).map((desc) => desc.type)} multiple field="singleCellValueTypes">
          {singleCellValueTypes.map((desc) => {
            return <Form.Select.Option value={desc.type}>{desc.label}</Form.Select.Option>
          })}
        </Form.Select>
        } */}
        <Form.Input field="findCell" label="输入查找的文本" placeholder='请输入'></Form.Input>
        <Form.Input field="replaceBy" label="替换为" placeholder='请输入'></Form.Input>

      </Form>
      <div className="findBtnContainer">
        <Button
          loading={findBtnLoading}
          disabled={disable || replaceAllLoading}

          className="bt1"
          theme='solid'
          type='primary'
          onClick={onClickFindBtn} >查找</Button>
        {withResult && <Button className="bt2"
          disabled={latestSuccessResultKey === resultKey}
          loading={replaceAllLoading}
          theme='solid'
          type='secondary'
          onClick={onClickReplaceAllbtn} >
          {replaceAllLoading ? '替换中' : '全部替换'}
        </Button>}
      </div>
      {withResult ? [<div id={'id' + resultKey} className="result">
        <p> 查找结果</p>
        <div>
          {/* <Button disabled={latestSuccessResultKey === resultKey}
            loading={replaceAllLoading}
            theme='solid'
            type='primary'
            onClick={onClickReplaceAllbtn} >
            {replaceAllLoading ? '替换中' : '全部替换'}
          </Button> */}
        </div>
      </div>,
      <div key={resultKey}> {replaceInfos.map((i) => <DiffCard successed={successed} key={i.field.id} {...i} ></DiffCard>)}</div>] : resultKey ?
        <div className="result"><p> 查找结果</p> <div className="emptyResult">未查找到匹配结果</div></div> : null}
    </div>
  );
}
