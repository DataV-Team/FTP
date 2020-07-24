import Client from 'ftp'

async function getList(ftp: Client, src: string): Promise<Client.ListingElement[]> {
  return new Promise((resolve, reject) => {
    ftp.list(src, (err, list) => {
      if (err) {
        reject(err)
      } else {
        resolve(list)
      }
    })
  })
}

async function rmDir(ftp: Client, src: string, recusive = true): Promise<void> {
  return new Promise((resolve, reject) => {
    ftp.rmdir(src, recusive, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function deleteFile(ftp: Client, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ftp.delete(src, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function emptyDir(ftp: Client, src: string, except: string[] = []): Promise<void> {
  const list = await getList(ftp, src)

  for (let i = 0, listNum = list.length; i < listNum; i++) {
    const { type, name } = list[i]

    if (type === 'd' && (name === '.' || name === '..')) continue
    if (except.find(n => n === name)) continue

    const fullSrc = `./${name}`

    if (type === 'd') {
      await rmDir(ftp, fullSrc, true)
    } else {
      await deleteFile(ftp, fullSrc)
    }
  }
}

async function put(ftp: Client, src: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ftp.put(src, dest, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function mkDir(ftp: Client, src: string, recusive = true): Promise<void> {
  return new Promise((resolve, reject) => {
    ftp.mkdir(src, recusive, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export { put, rmDir, mkDir, getList, emptyDir, deleteFile }
