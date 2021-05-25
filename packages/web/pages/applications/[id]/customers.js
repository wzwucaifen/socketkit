import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'

import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import CustomerColumns from 'helpers/columns/customer.js'
import CustomerPropTypes, { CustomerCursor } from 'helpers/types/customer.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, `applications/${query.id}/customers`, true)
}

function Customers({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => CustomerColumns, [])
  setDateRangeIfNeeded(router, '/applications/[id]/customers')

  return (
    <>
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.id}/customers`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.subscriber_id,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
        })}
      />
    </>
  )
}

Customers.propTypes = {
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(CustomerPropTypes).isRequired,
    cursor: CustomerCursor,
  }),
}

export default Customers
