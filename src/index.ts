import Client from 'ftp'

async function getList(ftp: Client, src: string): Promise<Client.ListingElement[] | false> {
  return new Promise(resolve => {
    ftp.list(src, (err, list) => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(list)
      }
    })
  })
}

async function rmDir(ftp: Client, src: string, recusive = true): Promise<boolean> {
  return new Promise(resolve => {
    ftp.rmdir(src, recusive, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function deleteFile(ftp: Client, src: string): Promise<boolean> {
  return new Promise(resolve => {
    ftp.delete(src, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function emptyDir(ftp: Client, src: string, except: string[] = []): Promise<boolean> {
  const list = await getList(ftp, src)
  if (!list) return false

  for (let i = 0, listNum = list.length; i < listNum; i++) {
    const { type, name } = list[i]

    if (type === 'd' && (name === '.' || name === '..')) continue
    if (except.find(n => n === name)) continue

    const fullSrc = `./${name}`

    if (type === 'd') {
      if (!(await rmDir(ftp, fullSrc, true))) return false
    } else {
      if (!(await deleteFile(ftp, fullSrc))) return false
    }
  }

  return true
}

async function put(ftp: Client, src: string, dest: string): Promise<boolean> {
  return new Promise(resolve => {
    ftp.put(src, dest, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function mkDir(ftp: Client, src: string, recusive = true): Promise<boolean> {
  return new Promise(resolve => {
    ftp.mkdir(src, recusive, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

export { put, rmDir, mkDir, getList, emptyDir, deleteFile }
