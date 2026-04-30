declare module '@mailchimp/mailchimp_marketing' {
  interface Config {
    apiKey: string
    server: string
  }

  interface MemberBody {
    email_address: string
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional'
    merge_fields?: Record<string, string>
    tags?: string[]
  }

  interface Lists {
    addListMember(listId: string, body: MemberBody): Promise<unknown>
  }

  const mailchimp: {
    lists: Lists
    setConfig(config: Config): void
  }

  export default mailchimp
}
