module.exports = {
  defaultTitle: 'Blobs',
  params: [
    {
      key: 'posZ',
      title: 'Pos Z',
      defaultValue: 0.5
    },
    {
      key: 'rotSpeedX',
      title: 'Rot Speed X',
      defaultValue: 0.5
    },
    {
      key: 'rotSpeedY',
      title: 'Rot Speed Y',
      defaultValue: 0.5
    },
    {
      key: 'rotSpeedZ',
      title: 'Rot Speed Z',
      defaultValue: 0.5
    },
    {
      key: 'blobSpeed',
      title: 'Blob Speed',
      defaultValue: 0.5
    },
    {
      key: 'numBlobs',
      title: 'Num Blobs',
      defaultValue: 0.5
    },
    {
      key: 'blobStrength',
      title: 'Blob Strength',
      defaultValue: 0.5
    }
  ],
  shots: [
    {
      method: 'spin',
      title: 'Spin'
    },
    {
      method: 'updateReflection',
      title: 'Update Reflection'
    }
  ]
}
