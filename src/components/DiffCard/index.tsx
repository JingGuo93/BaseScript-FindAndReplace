import { useState, useRef, useEffect } from 'react'
import { ReplaceInfos } from '../../utils'
import { Button, Toast, Tooltip } from '@douyinfe/semi-ui'
import './styles.css'
import { icons } from '../../App'

export default function DiffCard(props: ReplaceInfos & {
  successed: string[]
}) {
  const { field, fieldMeta, replaceAll, replaceInfo, table, toSetList } = props

  const [, _update] = useState<any>();
  const update = () => {
    _update({})
  }
  /** 已经设置成功的下标 */
  const settledIndex = useRef<Set<number>>(new Set([-1]))
  useEffect(() => {
    if (props.successed.length) {
      toSetList.forEach((list, index) => {
        const key = fieldMeta.id + ';' + list.recordId;
        if (props.successed.includes(key)) {
          settledIndex.current.add(index)
        }
      })
    }
    update();
  }, [props.successed.join('')])
  const fieldId = fieldMeta.id
  return (
    <div className='d'>
      <div className='fieldTitle'>
        {/* @ts-ignore */}
        {icons[fieldMeta.type]} {fieldMeta.name}
      </div>
      <div className='lists'>
        <div className='header'>
          <div>替换前</div>
          <div>替换后</div>
          <div className='operation'>操作</div>
        </div>
        <div>
          {
            toSetList.map((list, toSetListIndex) => {
              const info = replaceInfo.filter((r) => r.recordId === list.recordId)
              const { oldCellValue } = info[0]
              const { recordId, replaceKeys, value: newCellValue } = list
              let diff
              diff = <div className='diffCell'>
                <div className='old'>
                  {
                    Array.isArray(oldCellValue) ? oldCellValue.map((v: any, i) => {
                      return <div key={list.recordId + i} >
                        {/* TODO复杂字段目前显示的是text属性,链接是link属性 */}
                        {v.link ? <Tooltip content={`实际链接：\n${v.link}`}><a href={v.link}>{v.text} </a></Tooltip> : v.text}
                      </div>
                    }) : (oldCellValue as any)
                  }
                </div>
                <div className='new'>
                  {
                    Array.isArray(newCellValue) ? newCellValue.map((v: any, i) => {
                      return <div key={list.recordId + i} >
                        {/* TODO复杂字段目前显示的是text属性 */}
                        {v.link ? <Tooltip content={`实际链接：\n${v.link}`}><a href={v.link}>{v.text} </a></Tooltip> : v.text}
                      </div>
                    }) : (newCellValue as any)
                  }
                </div>
              </div>

              if (typeof newCellValue === 'string' || typeof newCellValue === 'number') {
                diff = <div className='diffCell'>
                  <div className='old'>{oldCellValue as any}</div>
                  <div className='new' >{newCellValue}</div>
                </div>
              }
              return <div key={list.recordId + toSetListIndex} className='diffList'>
                {[diff, <div className='btn'>
                  <Button
                    className='bt3'
                    disabled={settledIndex.current.has(toSetListIndex)}
                    onClick={() => {
                      table.setCellValue(fieldId, recordId, newCellValue).then((r) => {
                        if (r) {
                          settledIndex.current.add(toSetListIndex);
                          update();
                        }
                      }).catch((e) => {
                        Toast.error(`单元格设置失败${e}`)
                      })
                    }}>
                    {settledIndex.current.has(toSetListIndex) ? '已替换' : '替换'}</Button>
                </div>]}
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}
