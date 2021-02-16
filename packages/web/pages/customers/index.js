import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import Table from '../../components/table/table'
import DatePicker from '../../components/date-picker'
import { useRouter } from 'next/router'
import { fetcher } from '../../helpers/fetcher.js'

export default function Customers({ initialData }) {
  const router = useRouter()
  const { start_date, end_date } = router.query

  if (!start_date || !end_date) {
    router.push({
      path: '/customers',
      query: {
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
      },
    }, undefined, { shallow: true })
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Client',
        accessor: 'client_id',
      },
      {
        Header: 'Device',
        id: 'device_type_id',
        accessor: function DeviceAccessor(f) {
          return f.device_type_name
        },
      },
      {
        Header: 'Country',
        accessor: 'country_name',
      },
      {
        Header: 'Sales',
        accessor: (field) => `$${field.total_base_client_purchase}`,
      },
      {
        Header: 'Proceeds',
        accessor: (field) => `$${field.total_base_developer_proceeds}`,
      },
      {
        Header: 'First Interaction',
        accessor: function IntervalAccessor(f) {
          return dayjs(f.first_interaction).format('YYYY-MM-DD')
        },
      },
    ],
    [],
  )

  return (
    <>
      <div className="flex flex-1 justify-between mb-5 items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">
            Customers
          </h3>
        </div>
        <span className="hidden sm:block mr-3">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            type="button"
            onClick={() => router.push('/transactions')}
          >
            <svg
              aria-hidden="true"
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                fillRule="evenodd"
              />
            </svg>
            View Transactions
          </button>
        </span>
        <DatePicker
          interval={{ start_date: dayjs(start_date), end_date: dayjs(end_date) }} 
          setInterval={({start_date, end_date}) => {
            router.push({
              path: '/customers',
              query: { 
                start_date: start_date.format('YYYY-MM-DD'),
                end_date: end_date.format('YYYY-MM-DD'),
              }
            }, undefined, { shallow: true })
          }}
        />
      </div>
      <Table
        initialData={initialData}
        url="customers"
        options={{
          limit: 10,
          from: dayjs(start_date).format('YYYY-MM-DD'),
          to: dayjs(end_date).format('YYYY-MM-DD'),
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          id: original.client_id,
          onClick: () => router.push(`/customers/${original.client_id}`),
          className: 'hover:bg-gray-50 cursor-pointer',
        })}
      />
    </>
  )
}

export async function getServerSideProps(ctx) {
  const format = 'YYYY-MM-DD'
  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialData = await fetcher(`customers?from=${dayjs().subtract(1, 'month').format(format)}&to=${dayjs().format(format)}`, {
    headers: { cookie, referer }
  })
  return {
    props: { initialData },
  }
}
